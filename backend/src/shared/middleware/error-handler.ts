import { type Request, type Response, type NextFunction } from 'express';
import { AppError, InternalError } from '../errors/app-error';
import { logger } from '../logger/logger';
import { appConfig } from '../config/app';
import { HttpStatus } from '../constants/http-status';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    logger.error({ err, requestId: req.id }, err.message);

    res.status(err.statusCode).json({
      success: false,
      error: {
        name: err.name,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
        ...(appConfig.isDevelopment ? { stack: err.stack } : {}),
      },
    });
    return;
  }

  logger.fatal({ err, requestId: req.id }, 'Unhandled error');

  const internalError = new InternalError(
    appConfig.isDevelopment ? err.message : 'Internal server error',
  );

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      name: internalError.name,
      message: internalError.message,
      ...(appConfig.isDevelopment ? { stack: err.stack } : {}),
    },
  });
};
