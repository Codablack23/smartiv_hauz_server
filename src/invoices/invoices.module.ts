import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceAddOnEntity } from 'src/entities/entity.invoice_addon';
import { InvoiceEntity } from 'src/entities/entity.invoices';
import { CustomerEntity } from 'src/entities/entity.customer';
import { InvoiceProductEntity } from 'src/entities/entity.invoice_products';
import { InvoiceNoteEntity } from 'src/entities/entity.invoice_notes';
import { CustomerTokenGuard } from 'src/lib/guards';
import { CustomerTokenEntity } from 'src/entities/entity.customer_token';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceAddOnEntity,
      InvoiceEntity,
      CustomerEntity,
      InvoiceProductEntity,
      InvoiceNoteEntity,
      CustomerTokenEntity,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, CustomerService, CustomerTokenGuard],
})
export class InvoicesModule {}
