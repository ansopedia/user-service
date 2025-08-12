import fs from "fs";
import path from "path";
import pino, { type DestinationStream } from "pino";

import { envConstants } from "@/constants";

// Configure transport based on environment
const isDevelopment = ["development", "test", "local"].includes(envConstants.NODE_ENV);
const isProduction = envConstants.NODE_ENV === "production";

let transport: DestinationStream;

if (isDevelopment) {
  // In development, log to both console and file
  const logDirectory = path.join(process.cwd(), "log");
  
  // Try to create the log directory if it doesn't exist (only for development)
  try {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: Could not create log directory: ${(error as Error).message}`);
  }

  transport = pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
        level: envConstants.PINO_LOG_LEVEL ?? "info",
      },
      {
        target: "pino/file",
        options: { destination: path.join(logDirectory, "app.log") },
        level: envConstants.PINO_LOG_LEVEL ?? "info",
      },
    ],
  });
} else if (isProduction) {
  // In production, use console logging by default (works in serverless environments)
  // You can configure this to use cloud logging services like:
  // - AWS CloudWatch
  // - Google Cloud Logging
  // - Azure Monitor
  // - Third-party services like Datadog, Loggly, etc.
  
  transport = pino.transport({
    target: "pino-pretty",
    options: {
      colorize: false,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  });
} else {
  // For other environments (stage, etc.)
  transport = pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  });
}

export const logger = pino(
  {
    level: envConstants.PINO_LOG_LEVEL ?? "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env: envConstants.NODE_ENV,
      service: "user-service",
    },
  },
  transport
);

// Log initialization message
logger.info(`Logger initialized with log level: ${envConstants.PINO_LOG_LEVEL}`);

// Error logger - simplified for production compatibility
let errorTransport: DestinationStream;

if (isDevelopment) {
  const logDirectory = path.join(process.cwd(), "log");
  errorTransport = pino.transport({
    target: "pino/file",
    options: { destination: path.join(logDirectory, "server.log") },
  });
} else {
  // In production, use the same transport as main logger
  errorTransport = transport;
}

export const errorLogger = pino(
  {
    level: "error",
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env: envConstants.NODE_ENV,
      service: "user-service",
    },
  },
  errorTransport
);
