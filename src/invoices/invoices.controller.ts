/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateCustomerDto, UpdateInvoiceDto } from './dto/create-invoice.dto';
import type { CustomerRequest } from 'src/lib';
import { CustomerTokenGuard } from 'src/lib/guards/';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @UseGuards(CustomerTokenGuard)
  @Post('')
  generateNewInvoice(@Request() req: CustomerRequest) {
    return this.invoicesService.generateNewInvoice(req.customer?.id as string);
  }
  @Post('generate')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.invoicesService.generate(createCustomerDto);
  }

  @UseGuards(CustomerTokenGuard)
  @Get()
  findAll(@Request() req: CustomerRequest) {
    return this.invoicesService.findAll(req.customer?.id as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @UseGuards(CustomerTokenGuard)
  @Patch(':id')
  updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req: CustomerRequest,
  ) {
    return this.invoicesService.updateInvoice(
      req.customer?.id as string,
      id,
      updateInvoiceDto,
    );
  }

  @Get(':id/download')
  downloadInvoice(@Param('id') id: string, @Request() req, @Response() res) {
    return this.invoicesService.downloadInvoice(id, req, res);
  }

  @Post(':id/publish')
  publishInvoice(@Param('id') id: string) {
    return this.invoicesService.publishInvoice(id);
  }
}
