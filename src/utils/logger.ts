import pino from "pino";

import { envConstants } from "@/constants";

// Create a console logger
const logger = pino({
  level: envConstants.PINO_LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Create an error logger (also to console)
export const errorLogger = pino({
  level: "error",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
