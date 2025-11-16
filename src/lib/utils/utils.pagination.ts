import { PaginationData, PaginationQuery } from 'src/lib';

interface PaginationOptions {
  page: number;
  total: number;
  limit: number;
}

export class PaginationProvider {
  static getPagination({
    page,
    total,
    limit,
  }: PaginationOptions): PaginationData {
    const total_pages = Math.ceil(total / limit);

    // 🔹 Pagination logic
    const has_next_page = page < total_pages;
    const has_prev_page = page > 1;

    const next_page = has_next_page ? page + 1 : null;
    const prev_page = has_prev_page ? page - 1 : null;

    return {
      page,
      limit,
      total,
      total_pages,
      has_next_page,
      has_prev_page,
      next_page,
      prev_page,
    };
  }

  static getPaginationQuery(query: PaginationQuery, total: number = 1) {
    const page = parseFloat(query.page ?? '1');
    const limit = parseFloat(query.limit ?? '10');

    const skip = (page - 1) * limit;
    const take = limit;
    const pagination = this.getPagination({ page, total, limit });

    return {
      skip,
      take,
      page,
      limit,
      pagination,
    };
  }
}
