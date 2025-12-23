import { z } from 'zod';
import {
  booleanTransformSchema,
  portTransformSchema,
} from './transforms.schema';

export const envSchema = z.object({
  DEBUG: booleanTransformSchema(),
  PORT: portTransformSchema(),
});
