import { Request } from 'express';
import { CustomerEntity } from 'src/entities/entity.customer';

export interface CustomerRequest extends Request {
  customer?: CustomerEntity;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
