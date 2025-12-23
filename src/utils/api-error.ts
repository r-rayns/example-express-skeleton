import {
  ClientError,
  ServerError,
} from '../types/response-codes';
import { ErrorType } from '../types/errors';

export class ApiError extends Error {
  public message: string;
  public statusCode: ClientError | ServerError;
  public type: ErrorType;
  public details: unknown = null;

  constructor(message: string, statusCode: ClientError | ServerError, type: ErrorType, details: unknown = null) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
  }
}
