import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().readonly(),
  APP_PORT: z.coerce.number().readonly(),
  PINO_LOG_LEVEL: z.string().readonly(),
  NODE_ENV: z.string().readonly(),
});

export const envConstants = envSchema.parse(process.env);
