import { type PaginationParams, type PaginationMeta } from '../types/api-response';
export interface PaginationInput {
    page?: number;
    limit?: number;
}
export declare function parsePagination(input: PaginationInput): PaginationParams;
export declare function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map