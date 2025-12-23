import { z } from 'zod';

export const echoSchema = z.object({
  text: z.string()
    .min(1)
    .max(50),
});
