import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTokenEntity } from 'src/entities/entity.customer_token';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTokenEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
