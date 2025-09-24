import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateCustomerDto, UpdateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.invoicesService.generate(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
  @Patch(':id')
  updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.updateInvoice(id, updateInvoiceDto);
  }

  @Post(':id/publish')
  publishInvoice(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
}
