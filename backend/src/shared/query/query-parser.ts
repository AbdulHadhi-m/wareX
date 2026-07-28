import { type ParsedQuery, type QueryConfig, type QuerySort } from './query.types';
import { parsePagination } from '../utils/pagination';

export class QueryParser {
  static parse(raw: Record<string, unknown>, config: QueryConfig): ParsedQuery {
    const search = typeof raw.search === 'string' && raw.search.trim().length > 0
      ? raw.search.trim()
      : undefined;

    const filters: Record<string, unknown> = {};

    for (const field of config.filterableFields) {
      if (raw[field] !== undefined && raw[field] !== null && raw[field] !== '') {
        filters[field] = raw[field];
      }
    }

    let dateRange: Record<string, unknown> | undefined;

    if (config.dateRangeFields && config.dateRangeFields.length > 0) {
      const dateFrom = raw.dateFrom as string | undefined;
      const dateTo = raw.dateTo as string | undefined;

      if (dateFrom || dateTo) {
        const rangeFilter: Record<string, unknown> = {};
        const dateFilter: Record<string, unknown> = {};

        if (dateFrom) {
          dateFilter.$gte = new Date(dateFrom);
        }

        if (dateTo) {
          dateFilter.$lte = new Date(dateTo);
        }

        rangeFilter.$or = config.dateRangeFields.map((field) => ({
          [field]: dateFilter,
        }));

        dateRange = rangeFilter;
      }
    }

    const sortField = (raw.sortBy as string) || config.defaultSort.field;
    const sortOrder = (raw.sortOrder as 'asc' | 'desc') === 'asc' ? 'asc' : 'desc';
    const sort: QuerySort = { field: sortField, order: sortOrder };

    const pagination = parsePagination({
      page: raw.page ? Number(raw.page) : undefined,
      limit: raw.limit ? Number(raw.limit) : undefined,
    });

    let fields: string[] | undefined;

    if (typeof raw.fields === 'string' && raw.fields.trim().length > 0) {
      fields = raw.fields.split(',').map((f) => f.trim()).filter(Boolean);
    }

    return {
      search,
      filters,
      dateRange,
      sort,
      page: pagination.page,
      limit: pagination.limit,
      skip: pagination.skip,
      fields,
    };
  }
}
