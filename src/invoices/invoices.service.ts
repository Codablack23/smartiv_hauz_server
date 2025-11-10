/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto, UpdateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/entity.customer';
import { Repository } from 'typeorm';
import { InvoiceEntity, InvoiceStatus } from 'src/entities/entity.invoices';
import { InvoiceNoteEntity } from 'src/entities/entity.invoice_notes';
import { InvoiceAddOnEntity } from 'src/entities/entity.invoice_addon';
import { InvoiceProductEntity } from 'src/entities/entity.invoice_products';
import { DateTime } from 'luxon';
import { AppResponse } from 'src/lib/';
import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class InvoicesService {
  constructor(

    private customerService: CustomerService,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(InvoiceProductEntity)
    private invoiceProductRepository: Repository<InvoiceProductEntity>,
    @InjectRepository(InvoiceAddOnEntity)
    private invoiceAddonRepository: Repository<InvoiceAddOnEntity>,
    @InjectRepository(InvoiceNoteEntity)
    private invoiceNoteRepository: Repository<InvoiceNoteEntity>,
  ) { }

  async generateNewInvoice(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new ForbiddenException(AppResponse.getFailedResponse("Customer Details not found"))
    }

    const invoiceInstance = this.invoiceRepository.create({
      company_name: customer.company_name,
      customer,
      expires_at: DateTime.now().plus({ months: 1 }).toFormat('dd-mm-yyyy'),
    });

    const invoice = await this.invoiceRepository.save(invoiceInstance);

    return AppResponse.getSuccessResponse({
      data: {
        invoice_id: invoice.id,
      },
      message: 'Invoice generated successfully',
    });
  }
  async generate(createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (!customer) {
      const newCustomer = this.customerRepository.create({
        email: createCustomerDto.email,
        name: createCustomerDto.name,
        phone_number: createCustomerDto.phone_number,
        company_name: createCustomerDto.company_name,
      });

      const customerDetails = await this.customerRepository.save(newCustomer);
      const invoiceInstance = this.invoiceRepository.create({
        company_name: customerDetails.company_name,
        customer: customerDetails,
        expires_at: DateTime.now().plus({ months: 1 }).toFormat('dd-mm-yyyy'),
      });

      const invoice = await this.invoiceRepository.save(invoiceInstance);
      const customer_token = await this.customerService.generateCustomerToken(customerDetails)


      return AppResponse.getSuccessResponse({
        data: {
          invoice,
          customer_token,
        },
        message: 'Invoice generated successfully',
      });
    }

    const invoiceInstance = this.invoiceRepository.create({
      company_name: customer.company_name,
      customer,
      expires_at: DateTime.now().plus({ months: 1 }).toFormat('dd-mm-yyyy'),
    });

    const invoice = await this.invoiceRepository.save(invoiceInstance);
    const customer_token = await this.customerService.generateCustomerToken(customer)

    return AppResponse.getSuccessResponse({
      data: {
        invoice,
        customer_token,
      },
      message: 'Invoice generated successfully',
    });
  }

  async findAll(customerId: string) {
    const invoices = await this.invoiceRepository.find({
      where: {
        customer: {
          id: customerId
        }
      }
    })
    return AppResponse.getSuccessResponse({
      message: "Invoices Retrieved Successfully",
      data: {
        invoices,
      }
    })
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
      relations: {
        addons: true,
        products: true,
        notes: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(
        AppResponse.getFailedResponse('Invoice could not be found'),
      );
    }

    return AppResponse.getSuccessResponse({
      data: {
        invoice,
      },
      message: 'Invoice retrieved successfully',
    });
  }
async downloadInvoice(
  id: string,
  req: Request,
  res: Response,
  fileType: 'pdf' | 'image' = 'pdf',
) {
  const invoice = await this.invoiceRepository.findOne({
    where: { id },
    relations: { addons: true, products: true, notes: true },
  });

  if (!invoice) {
    throw new NotFoundException('Invoice could not be found');
  }

  const origin = `https://smartivhauz.com`;
  const invoiceUrl = `${origin}/invoices/${id}/view`;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();

    // ✅ 1. High-quality viewport (bigger is sharper)
    await page.setViewport({
      width: 1600,
      height: 2400,
      deviceScaleFactor: 2, // You can set 3 for extra clarity
    });

    await page.goto(invoiceUrl, { waitUntil: 'networkidle0' });

    let buffer: Buffer;
    let mimeType: string;
    let fileExtension: string;

    if (fileType === 'pdf') {
      // ✅ Improved PDF quality (A4 + better print resolution)
      buffer = (await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      })) as any;

      mimeType = 'application/pdf';
      fileExtension = 'pdf';

    } else {
      // ✅ Improved screenshot quality (high DPI)
      buffer = (await page.screenshot({
        fullPage: true,
        type: 'png',
      })) as any;

      mimeType = 'image/png';
      fileExtension = 'png';
    }

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename=invoice-${invoice.id}.${fileExtension}`,
      'Content-Length': buffer.length,
    });

    return res.end(buffer);

  } catch (err) {
    console.error('❌ Puppeteer error:', err);
    throw new NotFoundException('Failed to generate invoice file');
  } finally {
    await browser.close();
  }
}


  async publishInvoice(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
      relations: {
        addons: true,
        products: true,
        notes: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(
        AppResponse.getFailedResponse('Invoice could not be found'),
      );
    }
    if (invoice.status != InvoiceStatus.DRAFT) {
      throw new NotAcceptableException(
        AppResponse.getFailedResponse('Only draft invoices can be published'),
      );
    }

    invoice.status = InvoiceStatus.PUBLISHED;
    invoice.published_at = DateTime.now().toJSDate();

    await this.invoiceRepository.save(invoice);

    return AppResponse.getSuccessResponse({
      data: {
        invoice,
      },
      message: 'Invoice published successfully',
    });
  }

  async updateInvoice(customerId: string, id: string, updateInvoiceDto: UpdateInvoiceDto) {
  const invoice = await this.invoiceRepository.findOne({
    where: { id, customer: { id: customerId } },
    relations: {
      addons: true,
      products: true,
      notes: true,
    },
  });

  if (!invoice) {
    throw new NotFoundException(
      AppResponse.getFailedResponse('Invoice could not be found'),
    );
  }

  if (invoice.status != InvoiceStatus.DRAFT) {
    throw new NotAcceptableException(
      AppResponse.getFailedResponse('Only draft invoices can be edited'),
    );
  }

  // Extract relations and other fields
  const { products, addons, notes, ...rest } = updateInvoiceDto;

  // Merge top-level fields
  Object.assign(invoice, rest);

  // 🔴 First remove old relations
  await this.invoiceProductRepository.delete({ invoice: { id: invoice.id } });
  await this.invoiceAddonRepository.delete({ invoice: { id: invoice.id } });
  await this.invoiceNoteRepository.delete({ invoice: { id: invoice.id } });

  // 🟢 Reassign new ones only if provided
  if (products) {
    invoice.products = products.map((p) =>
      this.invoiceProductRepository.create({ ...p, invoice }),
    );
  } else {
    invoice.products = [];
  }

  if (addons) {
    invoice.addons = addons.map((a) =>
      this.invoiceAddonRepository.create({ ...a, invoice }),
    );
  } else {
    invoice.addons = [];
  }

  if (notes) {
    invoice.notes = notes.map((n) =>
      this.invoiceNoteRepository.create({ ...n, invoice }),
    );
  } else {
    invoice.notes = [];
  }

  const saved = await this.invoiceRepository.save(invoice);

  return AppResponse.getSuccessResponse({
    data: { invoice: saved },
    message: 'Invoice updated successfully',
  });
}


  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
