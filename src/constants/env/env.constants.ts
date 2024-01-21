import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URI = process.env.DATABASE_URI ?? '';
export const APP_PORT = process.env.APP_PORT ?? 8000;
export const PINO_LOG_LEVEL = process.env.PINO_LOG_LEVEL;
export const ENV = process.env.ENV;
