import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { ApiError } from '@utils/api-error';
import chalk from 'chalk';
import { ServerError } from 'types/response-codes';
import logger from '@utils/logger';
import { ErrorType } from '../types/errors';

const errorHandler = () => {
  // Do not remove the _next parameter as it will change the signature of the middleware and err will become the res
  return (err: Error | ApiError, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ApiError) {
      logger.log(chalk.red(`API ERROR: ${ err.message } - [${ err.statusCode }]`));
      res.status(err.statusCode).json({ type: err.type, error: err.message, details: err.details });
    } else {
      logger.log(chalk.red('UNKNOWN ERROR:'), err?.message || err);
      res.status(ServerError.INTERNAL_SERVER_ERROR).json({
        type: ErrorType.SERVER_ERROR,
        error: 'Server Error',
        details: null,
      });
    }
  };
};

export default errorHandler;
