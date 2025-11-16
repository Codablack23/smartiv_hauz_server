import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerTokenGuard } from 'src/lib/guards/customer.guard';
import type { CustomerRequest, PaginationQuery } from 'src/lib/types';
import { AppResponse } from 'src/lib';
import { JwtAuthGuard } from 'src/providers';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(CustomerTokenGuard)
  @Get()
  getCurrentCustomer(@Request() req: CustomerRequest) {
    return AppResponse.getSuccessResponse({
      message: 'Customer Access Granted',
      data: {
        customer: req.customer,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getCustomers(@Query() query: PaginationQuery) {
    return this.customerService.getCustomers(query);
  }
}
