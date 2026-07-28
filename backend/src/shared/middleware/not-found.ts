import { type Request, type Response } from 'express';
import { HttpStatus } from '../constants/http-status';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    error: {
      name: 'NotFoundError',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};
