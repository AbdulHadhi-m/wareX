import { type Request, type Response, type NextFunction } from 'express';
import { AppError, InternalError } from '../errors/app-error';
import { ValidationError } from '../errors/validation-error';
import { ConflictError } from '../errors/conflict-error';
import { logger } from '../logger/logger';
import { appConfig } from '../config/app';
import { HttpStatus } from '../constants/http-status';

interface MongooseErrorLike {
  name: string;
  errors?: Record<string, { path: string; message: string }>;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
}

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

  const mongooseErr = err as unknown as MongooseErrorLike;

  if (mongooseErr.name === 'ValidationError' && mongooseErr.errors) {
    const errorDetails = Object.values(mongooseErr.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    const validationError = new ValidationError('Validation failed', errorDetails);
    logger.warn({ err: validationError, requestId: req.id }, 'Mongoose validation error');

    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        name: validationError.name,
        message: validationError.message,
        details: errorDetails,
        ...(appConfig.isDevelopment ? { stack: err.stack } : {}),
      },
    });
    return;
  }

  if (mongooseErr.name === 'MongoServerError' && mongooseErr.code === 11000) {
    const conflictError = new ConflictError('A resource with this value already exists');
    logger.warn({ err, requestId: req.id }, 'Duplicate key error');

    res.status(HttpStatus.CONFLICT).json({
      success: false,
      error: {
        name: conflictError.name,
        message: conflictError.message,
        ...(appConfig.isDevelopment ? { details: mongooseErr.keyValue, stack: err.stack } : {}),
      },
    });
    return;
  }

  if (mongooseErr.name === 'CastError') {
    logger.warn({ err, requestId: req.id }, 'Invalid ID format');

    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        name: 'InvalidIdError',
        message: 'Invalid resource ID format',
        ...(appConfig.isDevelopment ? { stack: err.stack } : {}),
      },
    });
    return;
  }

  logger.fatal({ err, requestId: req.id, name: err.name, message: err.message }, 'Unhandled error');

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
