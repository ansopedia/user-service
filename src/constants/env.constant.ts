import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').readonly(),
  APP_PORT: z.coerce.number().min(1, 'APP_PORT is required and must be a number greater than 0').readonly(),
  PINO_LOG_LEVEL: z.string().min(1, 'PINO_LOG_LEVEL is required').readonly(),
  NODE_ENV: z.string().min(1, 'NODE_ENV is required').readonly(),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required').readonly(),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required').readonly(),
  MASTER_OTP: z.string().min(1, 'MASTER_OTP is required').readonly(),
  INITIAL_SETUP_DONE: z
    .string()
    .min(1, 'INITIAL_SETUP_DONE is required')
    .transform((value) => value === 'true')
    .readonly(),
});

export const envConstants = envSchema.parse(process.env);
