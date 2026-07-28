import { type Request, type Response, type NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const requestId = (req: Request, _res: Response, next: NextFunction): void => {
  req.id = (req.headers['x-request-id'] as string) || randomUUID();
  next();
};
