import chalk from 'chalk';
import stripAnsi from 'strip-ansi';
import {
  env,
  NodeEnv,
} from '../services/env-loader.service.js';

class Logger {
  private config: LoggerConfig;

  public constructor(config: LoggerConfig) {
    this.config = config;
  }

  /**
   * Logs an ISO timestamped message to the console
   * in production the timestamp and any ANSI formatting is removed
   */
  public log(...args: unknown[]): void {
    if (this.config.isProduction) {
      this.safeLog(...args);
    } else {
      const now = new Date().toISOString();
      console.log(`${ chalk.bold(now) }`, ...args);
    }
  }

  /**
   * Logs a message to the console when running with the debug flag
   */
  public debug(...args: unknown[]): void {
    if (this.config.debugEnabled) {
      this.log(...args);
    }
  }

  /**
   * Strips ANSI formatting from the message before printing it to the console
   * for environments that do not support ANSI codes
   */
  public safeLog(...args: unknown[]): void {
    const parsedArgs: unknown[] = args.map((arg) => {
      let parsedArg = arg;
      if (typeof arg === 'string') {
        parsedArg = stripAnsi(arg);
      }
      return parsedArg;
    });

    console.log(...parsedArgs);
  }
}

export interface LoggerConfig {
  debugEnabled: boolean;
  isProduction: boolean;
}

// Singleton
const logger = Object.freeze(new Logger({
  debugEnabled: true,
  isProduction: env.NODE_ENV === NodeEnv.PRODUCTION,
}));
export default logger;
