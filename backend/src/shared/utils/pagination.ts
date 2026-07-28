import { PAGINATION } from '../constants/app.constants';
import { type PaginationParams, type PaginationMeta } from '../types/api-response';

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export function parsePagination(input: PaginationInput): PaginationParams {
  const page = Math.max(1, input.page ?? PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, input.limit ?? PAGINATION.DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  const totalPages = Math.ceil(total / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrevious: params.page > 1,
  };
}
