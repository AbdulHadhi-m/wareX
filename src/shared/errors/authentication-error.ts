import { AppError } from './app-error';
import { HttpStatus } from '../constants/http-status';

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
