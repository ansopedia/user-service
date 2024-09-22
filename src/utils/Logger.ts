import path from "path";
import pino, { type DestinationStream } from "pino";
import fs from "fs";
import { envConstants } from "@/constants";

// Define the log directory path
const logDirectory = path.join(process.cwd(), "log");

// Create a basic console logger for logging errors in this setup phase
const consoleLogger = pino();

// Try to create the log directory if it doesn't exist
try {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
} catch (error) {
  consoleLogger.error(`Failed to create log directory: ${(error as Error).message}`);
  process.exit(1);
}

const transport: DestinationStream = pino.transport({
  target: "pino/file",
  options: { destination: path.join(logDirectory, "app.log") },
});

const logger = pino(
  {
    level: envConstants.PINO_LOG_LEVEL ?? "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

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

export default logger;
