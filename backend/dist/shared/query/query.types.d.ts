import { type PaginationMeta } from '../types/api-response';
export interface QueryConfig {
    searchableFields: string[];
    filterableFields: string[];
    dateRangeFields?: string[];
    sortableFields: string[];
    defaultSort: QuerySort;
    baseFilter?: Record<string, unknown>;
}
export interface QuerySort {
    field: string;
    order: 'asc' | 'desc';
}
export interface ParsedQuery {
    search?: string;
    filters: Record<string, unknown>;
    dateRange?: Record<string, unknown>;
    sort: QuerySort;
    page: number;
    limit: number;
    skip: number;
    fields?: string[];
}
export interface QueryResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface MongoQuery {
    filter: Record<string, unknown>;
    sort: Record<string, 1 | -1>;
    skip: number;
    limit: number;
    projection: Record<string, 1>;
}
//# sourceMappingURL=query.types.d.ts.map