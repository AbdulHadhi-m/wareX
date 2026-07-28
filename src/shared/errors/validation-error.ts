import { AppError } from './app-error';
import { HttpStatus } from '../constants/http-status';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, details);
  }
}
