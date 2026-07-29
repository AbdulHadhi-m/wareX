import rateLimit from 'express-rate-limit';
import { environment } from '../config/environment';
import { HttpStatus } from '../constants/http-status';

const standardLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT_WINDOW_MS,
  max: environment.RATE_LIMIT_MAX,
  handler: (_req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        name: 'RateLimitError',
        message: 'Too many requests. Please try again later.',
      },
    });
  },
});

const authLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT_WINDOW_MS,
  max: environment.RATE_LIMIT_AUTH_MAX,
  handler: (_req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        name: 'RateLimitError',
        message: 'Too many authentication attempts. Please try again later.',
      },
    });
  },
});

export { standardLimiter, authLimiter };
