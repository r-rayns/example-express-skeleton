import express, { Express } from 'express';
import cors from 'cors';
import { requestResponseLogger } from './middleware/request-response-logger';
import {
  env,
  NodeEnv,
} from './services/env-loader.service';
import { missingRoute } from '@utils/errors';
import api from './routes/api';
import errorHandler from './middleware/error-handler';

export function createExpressServer(): Express {
  const isProduction = env.NODE_ENV === NodeEnv.PRODUCTION;

  const expressServer: Express = express();
  // Set up the request-response logger
  expressServer.use(requestResponseLogger);

  expressServer.use(express.json({ limit: '2MB' }));

  if (!isProduction) {
    // Permissive CORS policy only in development, default in production
    expressServer.use(cors({ origin: '*' }));
  } else {
    // Basic production CORS policy (Update inline with project specific needs)
    expressServer.use(cors({
      origin: false, // Blocks all CORS - update inline with project needs
      methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ],
      maxAge: 86_400, // 24 hours preflight cache
    }));
  }

  // Set up the API routes
  expressServer.use('/api', api);

  // Catch invalid routes
  expressServer.use('', () => {
    throw missingRoute;
  });

  // Error handler must be placed after all other routes have been set up
  // This will gracefully handle any unexpected errors
  expressServer.use(errorHandler());

  return expressServer;
}
