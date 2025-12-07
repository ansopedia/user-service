import cors from "cors";
import express, { type Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { pinoHttp } from "pino-http";

import {
  ErrorTypeEnum,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_MESSAGE,
  RATE_LIMIT_WINDOW_MS,
  envConstants,
} from "@/constants";
import { addAxiosHeadersMiddleware, allowedOrigins, botDetectionMiddleware, errorHandler } from "@/middlewares";
import { routes } from "@/routes";
import { errorLogger, logger } from "@/utils";

import "./config/passport.js";
import { ROUTES } from "./constants/routes.constant.js";

const { NODE_ENV } = envConstants;

export const app: Application = express();

if (NODE_ENV !== "test") {
  // Apply Helmet middleware with default options
  app.use(helmet());
  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (origin === undefined) {
        return callback(null, true);
      }

      // Check if origin matches any allowed pattern
      const isAllowed = allowedOrigins.some((pattern) => {
        if (typeof pattern === "string" && pattern.startsWith("*.")) {
          const domain = pattern.slice(2); // Remove '*.'
          return origin.endsWith(domain);
        }
        if (typeof pattern === "string" && pattern.endsWith(":*")) {
          const base = pattern.slice(0, -2); // Remove ':*'
          return origin.startsWith(`${base}:`);
        }
        return pattern === origin;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      if (envConstants.NODE_ENV !== "development") {
        errorLogger.error(`origin ${origin} is not allowed. Allowed origins: ${JSON.stringify(allowedOrigins)}`);
      }
      return callback(new Error(ErrorTypeEnum.enum.ORIGIN_NOT_ALLOWED), false);
    },
    credentials: true,
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));
}

const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // RATE_LIMIT_WINDOW_MS minutes
  max: RATE_LIMIT_MAX_REQUESTS, // Limit each IP to RATE_LIMIT_MAX_REQUESTS requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: RATE_LIMIT_MESSAGE,
});

app.use(globalLimiter);

// Bot detection middleware - early in the chain to block bots before processing
app.use(botDetectionMiddleware);

app.use(express.json());
app.use(passport.initialize());
app.use(pinoHttp({ logger }));
app.use(addAxiosHeadersMiddleware);
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(ROUTES.API_ROOT, routes);

// Handling non matching request from the client
app.use((_req, _res, next) => {
  next(new Error(ErrorTypeEnum.enum.RESOURCE_NOT_FOUND));
});

app.use(errorHandler);
