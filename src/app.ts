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
import { addAxiosHeadersMiddleware, errorHandler } from "@/middlewares";
import { routes } from "@/routes";
import { logger } from "@/utils";

import "./config/passport";

const { NODE_ENV } = envConstants;

export const app: Application = express();

if (NODE_ENV !== "test") {
  // Apply Helmet middleware with default options
  app.use(helmet());
  const allowedOrigins = [envConstants.CLIENT_URL, envConstants.USER_SERVICE_BASE_URL].filter(Boolean);

  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (origin === undefined || origin === null) {
        return callback(null, true);
      }

      // Check if origin is in allowed list

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (envConstants.NODE_ENV !== "development") {
        logger.warn(`CORS request from disallowed origin: ${origin}`);
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

app.use(express.json());
app.use(passport.initialize());
app.use(pinoHttp({ logger }));
app.use(addAxiosHeadersMiddleware);
app.use(morgan("dev"));

app.use("/api/v1", routes);

// Handling non matching request from the client
app.use("*", () => {
  throw new Error(ErrorTypeEnum.enum.RESOURCE_NOT_FOUND);
});

app.use(errorHandler);
