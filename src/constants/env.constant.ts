import dotenv from "dotenv";
import fs from "fs";
import { type SignOptions } from "jsonwebtoken";
import path from "path";
import { z } from "zod";

import { userSchema } from "@/api/v1/user/user.validation.js";

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV ?? "development";

// Always load the root .env file first
dotenv.config();

// For non-production environments, load specific env file if it exists
if (nodeEnv !== "production") {
  const envPath = path.resolve(process.cwd(), "environments", `.env.${nodeEnv.toLowerCase()}`);

  // Check if environment file exists before loading
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Define environment schema with optional() for development flexibility
const envSchema = z.object({
  DATABASE_URI: z.string().min(1, "DATABASE_URI is required").readonly(),
  APP_PORT: z.coerce.number().min(1, "APP_PORT is required and must be a number greater than 0").readonly(),
  DB_NAME: z.string().min(1, "DB_NAME is required").readonly(),
  PINO_LOG_LEVEL: z.string().min(1, "PINO_LOG_LEVEL is required").readonly(),
  NODE_ENV: z
    .enum(["development", "stage", "local", "test", "production"], {
      required_error: "NODE_ENV is required and must be one of development, stage, local, test, or production",
    })
    .readonly(),
  ACTION_TOKEN_SECRET: z.string().min(1, "ACTION_TOKEN_SECRET is required").readonly(),
  ACCESS_TOKEN_EXPIRES_IN: z.custom<SignOptions["expiresIn"]>().readonly(),
  REFRESH_TOKEN_EXPIRES_IN: z.custom<SignOptions["expiresIn"]>().readonly(),
  ACTION_TOKEN_EXPIRES_IN: z.custom<SignOptions["expiresIn"]>().readonly(),
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
  REDIS_HOST: z.string().min(1, "REDIS_HOST is required").readonly(),
  REDIS_PASSWORD: z.string().min(1, "REDIS_PASSWORD is required").readonly(),
  REDIS_PORT: z.coerce
    .number()
    .int("REDIS_PORT must be an integer")
    .min(1, "REDIS_PORT must be greater than 0")
    .max(65535, "REDIS_PORT must be less than or equal to 65535")
    .readonly(),
  REDIS_DB: z.coerce
    .number()
    .int("REDIS_DB must be an integer")
    .min(0, "REDIS_DB must be greater than or equal to 0")
    .max(15, "REDIS_DB must be between 0 and 15")
    .readonly(),
  REDIS_USERNAME: z.string().min(1, "REDIS_USERNAME is required").readonly(),
});

export const envConstants = envSchema.parse(process.env);
