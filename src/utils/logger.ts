import fs from "fs";
import path from "path";
import pino, { type DestinationStream } from "pino";

import { envConstants } from "@/constants";

// Define the log directory path
const logDirectory = path.join(process.cwd(), "log");

// Try to create the log directory if it doesn't exist
try {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`Failed to create log directory: ${(error as Error).message}`);
  process.exit(1);
}

// Configure transport based on environment
const isDevelopment = process.env.NODE_ENV === "development";

let transport: DestinationStream;

if (isDevelopment) {
  // In development, log to both console and file
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
} else {
  // In production, log only to file
  transport = pino.transport({
    target: "pino/file",
    options: { destination: path.join(logDirectory, "app.log") },
  });
}

const logger = pino(
  {
    level: envConstants.PINO_LOG_LEVEL ?? "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

// Log initialization message
logger.info(`Logger initialized with log level: ${envConstants.PINO_LOG_LEVEL}`);

const errorTransport: DestinationStream = pino.transport({
  target: "pino/file",
  options: { destination: path.join(logDirectory, "server.log") },
});

export const errorLogger = pino(
  {
    level: "error",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  errorTransport
);

logger.info("Logger is ready to use");

export default logger;
