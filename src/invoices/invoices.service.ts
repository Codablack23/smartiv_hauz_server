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
  async downloadInvoice(id: string, req: Request, res: Response) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: {
        addons: true,
        products: true,
        notes: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice could not be found');
    }

    // ✅ Dynamically build the frontend invoice URL from request origin
    const origin = `https://smartivhauz.com`;
    const invoiceUrl = `${origin}/invoices/${id}`; // this should be your Next.js invoice route
    console.log({ origin, req, invoiceUrl })
    // ✅ launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // ✅ navigate to frontend invoice page
    await page.goto(invoiceUrl, {
      waitUntil: 'networkidle0',
    });

    // ✅ generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    // ✅ set headers for download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${invoice.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    return res.end(pdfBuffer);
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
