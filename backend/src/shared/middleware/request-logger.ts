import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '../logger/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      contentLength: res.getHeader('content-length') || 0,
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
    });
  });

  next();
};
