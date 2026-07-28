import { type Response } from 'express';
import { type PaginationMeta } from '../types/api-response';
export declare function sendSuccess<T>(res: Response, data: T, statusCode?: number, meta?: PaginationMeta): void;
export declare function sendCreated<T>(res: Response, data: T): void;
export declare function sendNoContent(res: Response): void;
//# sourceMappingURL=api-response.d.ts.map