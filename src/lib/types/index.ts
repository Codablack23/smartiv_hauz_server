import { Request } from 'express';
import { CustomerEntity } from 'src/entities/entity.customer';

export interface CustomerRequest extends Request {
  customer?: CustomerEntity;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
}
