import { ApiError } from './api-error';
import { ClientError } from '../types/response-codes';
import { ErrorType } from '../types/errors';

export const missingRoute: ApiError = new ApiError(
  'Route not found',
  ClientError.NOT_FOUND,
  ErrorType.MISSING_ROUTE,
);

export const missingResource =
  (message = 'No such resource') => {
    return new ApiError(
      message,
      ClientError.NOT_FOUND,
      ErrorType.MISSING_RESOURCE,
    );
  };
