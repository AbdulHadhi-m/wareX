import { AppError } from './app-error';
import { HttpStatus } from '../constants/http-status';

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
