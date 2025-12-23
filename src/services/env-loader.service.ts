import fs from 'node:fs';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { envSchema } from '../validation-schema/env.schema';
import { ZodError } from 'zod';

class EnvLoaderService {
  private acceptedEnvironments: string[] = Object.values(NodeEnv);
  public env: Env & EnvFile;

  /**
   * Constructs a new instance of the EnvLoaderService.
   * It will attempt to load the .env file and validate it against the schema defined in {@link envSchema}.
   */
  constructor() {
    // Attempt to load the secrets file
    if (process.env.NODE_ENV) {
      // Check we are running in an accepted environment
      if (!this.acceptedEnvironments.includes(process.env.NODE_ENV)) {
        console.log(chalk.red(`⛔ Unrecognised node environment ${ process.env.NODE_ENV }.
          Accepted environments: ${ this.acceptedEnvironments }`), '\nExiting...');
        process.exit(1);
      }
      // Load the .env file
      if (fs.existsSync('.env')) {
        dotenv.config();
        this.env = this.loadEnv(process.env.NODE_ENV as NodeEnv);
      } else {
        console.error(chalk.red('.env file was not found. Make sure it exists in the root directory of the project.'));
        process.exit(1);
      }
    } else {
      console.error(chalk.red('No NODE_ENV environment variable was not found. Did you set it?'));
      process.exit(1);
    }
  }

  private loadEnv(nodeEnv: NodeEnv): Env & EnvFile {
    let env: Env & EnvFile;
    try {
      const validatedEnvFile = envSchema.parse(process?.env);
      env = {
        NODE_ENV: nodeEnv,
        ...validatedEnvFile,
      };
    } catch (err: ZodError | unknown) {
      let errorMessage = err;
      if (err instanceof ZodError) {
        errorMessage = err.issues;
      }

      console.log(chalk.red('⛔ Environment variables failed validation with the following error(s):'), errorMessage);
      console.log('Exiting...');
      process.exit(1);

    }
    console.log(chalk.green(`Environment variables successfully loaded. Running in ${ env.NODE_ENV } mode.`));
    return env;
  }
}

export interface Env {
  NODE_ENV: NodeEnv;
}

export interface EnvFile {
  DEBUG: boolean;
  PORT: number;
}

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

export const env = Object.freeze(new EnvLoaderService().env);
