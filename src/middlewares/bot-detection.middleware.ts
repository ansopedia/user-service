import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { errorLogger, getDeviceInfo, sendResponse } from "@/utils";

/**
 * Middleware to detect and block bots at the API gateway level.
 * This should be placed early in the middleware chain to reject bots before they reach services.
 * For microservices, implement this in your API gateway (e.g., Kong, Express Gateway, or custom).
 */
export const botDetectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Capture device info
    const deviceInfo = getDeviceInfo(req);

    // Skip bot detection in development and test environments
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    // Block bots immediately
    if (deviceInfo.isBot) {
      return sendResponse({
        response: res,
        message: "Access forbidden: Bot detected",
        statusCode: STATUS_CODES.FORBIDDEN,
        data: null,
      });
    }

    // Attach deviceInfo to request for downstream services
    req.deviceInfo = deviceInfo;

    next();
  } catch (error) {
    // Log error and continue (don't block legitimate requests due to detection errors)
    if (error instanceof Error) {
      errorLogger.error(`Bot detection error: ${error.message}`);
    } else {
      errorLogger.error(`Bot detection error: ${String(error)}`);
    }
    next();
  }
};
