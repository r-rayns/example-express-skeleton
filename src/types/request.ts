import { Request } from 'express';

/**
 * Express request with a typed body
 */
export interface RequestWithBody<T> extends Request {
  body: T;
}

/**
 * Express request with typed params
 */
export interface RequestWithParams<T extends Request['params']> extends Request {
  params: T;
}

/**
 * Similar to RequestWithParams but uses an intersection type instead of extending Request.
 *
 * This type is required because RequestWithParams breaks if you run validation middleware (e.g. Zod)
 * that transforms the params into richer types like numbers or enums. Essentially we get around
 * the strict typing of Express `params` where they must all be strings.
 */
export type RequestWithValidatedParams<T> = Request & { params: T };

/**
 * Express request with typed query parameters
 */
export interface RequestWithQuery<T extends Request['query']> extends Request {
  query: T;
}
