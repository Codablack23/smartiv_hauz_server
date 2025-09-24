import {
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

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepoistory: Repository<CustomerEntity>,
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(InvoiceProductEntity)
    private invoiceProductRepository: Repository<InvoiceProductEntity>,
    @InjectRepository(InvoiceAddOnEntity)
    private invoiceAddonRepository: Repository<InvoiceAddOnEntity>,
    @InjectRepository(InvoiceNoteEntity)
    private invoiceNoteRepository: Repository<InvoiceNoteEntity>,
  ) {}

  async generate(createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerRepoistory.findOne({
      where: { email: createCustomerDto.email },
    });

    if (!customer) {
      const newCustomer = this.customerRepoistory.create({
        email: createCustomerDto.email,
        name: createCustomerDto.name,
        phone_number: createCustomerDto.phone_number,
        company_name: createCustomerDto.company_name,
      });

      const customerDetails = await this.customerRepoistory.save(newCustomer);
      const invoiceInstance = this.invoiceRepository.create({
        company_name: customerDetails.company_name,
        customer: customerDetails,
        expires_at: DateTime.now().plus({ months: 1 }).toFormat('dd-mm-yyyy'),
      });

      const invoice = await this.invoiceRepository.save(invoiceInstance);

      return AppResponse.getSuccessResponse({
        data: {
          invoice,
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

    return AppResponse.getSuccessResponse({
      data: {
        invoice,
      },
      message: 'Invoice generated successfully',
    });
  }

  findAll() {
    return `This action returns all invoices`;
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

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
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

    // Exclude customer
    const { products, addons, notes, ...rest } = updateInvoiceDto;

    // Merge top-level fields (company_name, subject, etc.)
    Object.assign(invoice, rest);

    // Replace relations only if provided
    if (products) {
      invoice.products = products.map((p) =>
        this.invoiceProductRepository.create({ ...p, invoice }),
      );
    }

    if (addons) {
      invoice.addons = addons.map((a) =>
        this.invoiceAddonRepository.create({ ...a, invoice }),
      );
    }

    if (notes) {
      invoice.notes = notes.map((n) =>
        this.invoiceNoteRepository.create({ ...n, invoice }),
      );
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
