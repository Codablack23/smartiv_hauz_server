import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppResponse } from 'src/lib';
import { CustomerTokenEntity } from 'src/entities/entity.customer_token';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CustomerEntity } from 'src/entities/entity.customer';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerTokenEntity)
    private customerTokenRepo: Repository<CustomerTokenEntity>,
  ) {}

  async getCustomer(token: string) {
    const customerToken = await this.customerTokenRepo.findOne({
      where: { id: token },
      relations: ['customer'],
    });

    if (!customerToken) {
      throw new UnauthorizedException(
        AppResponse.getFailedResponse("Sorry you can't access this data"),
      );
    }

    if (DateTime.fromJSDate(customerToken.expires_at) <= DateTime.now()) {
      throw new UnauthorizedException(
        AppResponse.getFailedResponse('Token has expired'),
      );
    }

    return customerToken.customer;
  }

  async generateCustomerToken(customer: CustomerEntity) {
    const newCustomerToken = this.customerTokenRepo.create({
      customer,
    });
    const customerToken = await this.customerTokenRepo.save(newCustomerToken);
    return customerToken.id;
  }
}
