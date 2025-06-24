import fs from "fs";
import path from "path";
import pino, { type DestinationStream } from "pino";

import { envConstants } from "@/constants";

// Define the log directory
const logDirectory = path.join(process.cwd(), "log");

// Console logger for setup diagnostics
const consoleLogger = pino();

const isDevelopment = envConstants.NODE_ENV === "development";

// Create log directory (only in production)
if (!isDevelopment) {
  try {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }
  } catch (error) {
    consoleLogger.error(`Failed to create log directory: ${(error as Error).message}`);
    process.exit(1);
  }
}




const transport: DestinationStream = isDevelopment
  ? pino.transport({
    target: require.resolve("pino-pretty"),
    options: {
      colorize: true,
      destination: 1, // console
      levelFirst: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname,time",
      singleLine: true,
    },
  })
  : pino.transport({
    target: "pino/file",
    options: {
      destination: path.join(logDirectory, "server.log"),
      mkdir: true,
      append: true,
    },
  });

const logger = pino(
  {
    level: (envConstants.PINO_LOG_LEVEL ?? isDevelopment) ? "debug" : "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

const errorTransport: DestinationStream = isDevelopment
  ? pino.destination(1) // console
  : pino.transport({
    target: "pino/file",
    options: {
      destination: path.join(logDirectory, "server-error.log"),
      mkdir: true,
      append: true,
    },
  });

export const errorLogger = pino(
  {
    level: "error",
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      pid: false,
    },
  },
  errorTransport
);

export default logger;
