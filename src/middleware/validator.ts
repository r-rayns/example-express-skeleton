import {
  z,
  ZodError,
} from 'zod';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import chalk from 'chalk';
import logger from '../utils/logger';
import {
  ClientError,
  ServerError,
} from '../types/response-codes';
import { ValidationProperty } from '../types/validation-property';
import { ErrorType } from '../types/errors';

/**
 * Returns a middleware function that validates a value in the request object
 * using the provided Zod schema.
 */
export const validate = (schema: z.ZodTypeAny, property: ValidationProperty = ValidationProperty.BODY) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    const value: unknown = req[ property ];
    logger.debug('Received value', JSON.stringify(value), 'for property', property);

    try {
      // Parse the value using the provided schema
      const parsedValues = await schema.parseAsync(value);
      // Now overwrite the raw request value with the parsed data
      if (property === ValidationProperty.QUERY) {
        // In Express req.query is a readonly getter which we cannot mutate
        // Instead we must replace the entire query object with the parsed values
        Object.defineProperty(req, 'query', {
          value: parsedValues,
          writable: false, // Keep as readonly
        });
      } else {
        // Overwrite the raw request value with the validated values
        req[ property ] = parsedValues;
      }
      next();
    } catch (error: ZodError | unknown) {
      if (error instanceof ZodError) {
        // Log the validation error and send a 400 response
        logger.log(chalk.bold.bgRed('Validation error:'), error.issues);
        res.status(ClientError.BAD_REQUEST).json({
          type: ErrorType.VALIDATION_ERROR,
          error: 'Validation error',
          details: error.issues,
        });
      } else {
        // Log the unexpected error and send a 500 response
        logger.log(chalk.bgRed('Unexpected validation error'), error);
        res.status(ServerError.INTERNAL_SERVER_ERROR).json({
          type: ErrorType.SERVER_ERROR,
          error: 'Unexpected error during validation',
          details: null,
        });
      }
    }
  };
};
