import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTokenEntity } from 'src/entities/entity.customer_token';
import { CustomerEntity } from 'src/entities/entity.customer';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTokenEntity, CustomerEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
