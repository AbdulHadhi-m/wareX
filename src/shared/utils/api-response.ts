import { type Response } from 'express';
import { type ApiResponse, type PaginationMeta } from '../types/api-response';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: PaginationMeta): void {
  const body: ApiResponse<T> = { success: true, data };

  if (meta) {
    body.meta = meta;
  }

  res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
