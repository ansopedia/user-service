import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

import { userSchema } from "@/api/v1/user/user.validation";

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(process.cwd(), "environments", `.env.${nodeEnv.toLowerCase()}`);

// Check if environment file exists before loading
if (!fs.existsSync(envPath)) {
  throw new Error(`Environment file ${envPath} not found`);
}

dotenv.config({ path: envPath });

// Define environment schema with optional() for development flexibility
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").readonly(),
  APP_PORT: z.coerce.number().min(1, "APP_PORT is required and must be a number greater than 0").readonly(),
  DB_NAME: z.string().min(1, "DB_NAME is required").readonly(),
  PINO_LOG_LEVEL: z.string().min(1, "PINO_LOG_LEVEL is required").readonly(),
  NODE_ENV: z
    .enum(["development", "stage", "local", "test", "production"], {
      required_error: "NODE_ENV is required and must be one of development, stage, local, test, or production",
    })
    .readonly(),
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
});

export const envConstants = envSchema.parse(process.env);
