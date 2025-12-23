import logger from './utils/logger.js';
import { createExpressServer } from './express-server';
import { createServer } from 'http';
import chalk from 'chalk';
import { env } from './services/env-loader.service';

const expressServer = createExpressServer();
const httpServer = createServer(expressServer);

httpServer.listen(env.PORT, () => {
  logger.log(chalk.blue(`⚡️ The express server is listening for HTTP clients on port ${ env.PORT }`));
});
