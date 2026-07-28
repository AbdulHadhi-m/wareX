export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        name: string;
        message: string;
        details?: unknown;
        stack?: string;
    };
    meta?: PaginationMeta;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}
export interface SortParams {
    field: string;
    order: 'asc' | 'desc';
}
//# sourceMappingURL=api-response.d.ts.map