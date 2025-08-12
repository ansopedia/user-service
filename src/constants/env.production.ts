import { z } from "zod";

import { userSchema } from "@/api/v1/user/user.validation";

// Production environment schema - more flexible for production deployment
const productionEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").readonly(),
  APP_PORT: z.coerce.number().min(1, "APP_PORT must be a valid port number").readonly(),
  DB_NAME: z.string().min(1, "DB_NAME is required").readonly(),
  PINO_LOG_LEVEL: z.string().default("info").readonly(),
  NODE_ENV: z.literal("production").readonly(),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required").readonly(),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required").readonly(),
  JWT_TOKEN_FOR_ACTION_SECRET: z.string().min(1, "JWT_TOKEN_FOR_ACTION_SECRET is required").readonly(),
  MASTER_OTP: z.string().min(1, "MASTER_OTP is required").readonly(),
  DEFAULT_SUPER_ADMIN_USERNAME: userSchema.shape.username.readonly(),
  DEFAULT_SUPER_ADMIN_EMAIL: z.string().email().readonly(),
  DEFAULT_SUPER_ADMIN_PASSWORD: userSchema.shape.password.readonly(),
  NOTIFICATION_SERVICE_BASE_URL: z.string().url().readonly(),
  USER_SERVICE_BASE_URL: z.string().url().readonly(),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required").readonly(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required").readonly(),
  GOOGLE_CLIENT_URL: z.string().url().readonly(),
  CLIENT_URL: z.string().url().readonly(),
  PUBLIC_KEY: z.string().min(1, "PUBLIC_KEY is required").readonly(),
  PRIVATE_KEY: z.string().min(1, "PRIVATE_KEY is required").readonly(),
  REDIS_HOST: z.string().default("localhost").readonly(),
  REDIS_PASSWORD: z.string().optional().readonly(),
  REDIS_PORT: z.coerce.number().default(6379).readonly(),
  REDIS_DB: z.coerce.number().default(0).readonly(),
  REDIS_USERNAME: z.string().optional().readonly(),
});

// For production, use system environment variables directly
export const envConstants = productionEnvSchema.parse(process.env);
