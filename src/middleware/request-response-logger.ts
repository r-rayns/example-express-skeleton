import {
  NextFunction,
  Request,
  Response,
} from 'express';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import {
  env,
  NodeEnv,
} from '../services/env-loader.service';
import { isNil } from 'es-toolkit';

const placeholder = '_';

export function requestResponseLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const isProduction = env.NODE_ENV === NodeEnv.PRODUCTION;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method || placeholder;
    const isOptionsMethod = method.toLowerCase() === 'options';
    const url = req.originalUrl || placeholder;
    // Colour the status and response time
    const status = colourStatusCode(res.statusCode, isOptionsMethod);
    const responseTime = colourResponseTime(duration, isOptionsMethod);

    const contentLength = res.getHeader('content-length') ?? placeholder;

    const permissiveCorsMessage = chalk.yellow(' (i) Permissive CORS policy is active');
    const corsOriginPolicy = res.getHeader('access-control-allow-origin') === '*' ? permissiveCorsMessage: '';

    const logLine = [
      // No need to log time in production, that is done by sys log
      !isProduction ? chalk.bold(DateTime.now().toISOTime()): null,
      isOptionsMethod ? method: chalk.blue(method),
      url,
      status,
      responseTime,
      `- (response-length: ${ contentLength })`,
      isOptionsMethod ? '': corsOriginPolicy,
    ].filter(str => !isNil(str))
      .join(' ');

    console.log(logLine);
  });

  next();
}

function colourStatusCode(statusCode: number | undefined, isOptions: boolean): string {
  let statusCodeText = '';

  if (isNil(statusCode)) {
    statusCodeText = placeholder;
  } else if (statusCode >= 500) {
    statusCodeText = chalk.red(statusCode);
  } else if (statusCode >= 400) {
    statusCodeText = chalk.yellow(statusCode);
  } else if (statusCode >= 300) {
    statusCodeText = chalk.cyan(statusCode);
  } else if (statusCode >= 200 && !isOptions) {
    statusCodeText = chalk.green(statusCode);
  }
  return statusCodeText;
}

function colourResponseTime(ms: number, isOptions: boolean): string {
  let formattedResponseTime: string;
  if (isNil(ms)) {
    formattedResponseTime = placeholder;
  } else if (isOptions) {
    formattedResponseTime = `${ ms }ms`;
  } else if (ms < 100) {
    formattedResponseTime = chalk.green.bold(`${ ms }ms`);
  } else if (ms < 200) {
    formattedResponseTime = chalk.yellow.bold(`${ ms }ms`);
  } else {
    formattedResponseTime = chalk.red.bold(`${ ms }ms`);
  }

  return formattedResponseTime;
}
