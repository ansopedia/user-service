import cors from "cors";
import express, { type Application, NextFunction, Request, Response } from "express";
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

  // Apply CORS middleware with a whitelist (adjust origins as needed)
  const allowedOrigins = ["http://localhost:3000"];
  const allowedPathsWithoutOrigin = ["/api/v1/auth/google/callback", "/api/v1/auth/google"];

  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (origin === undefined) {
        callback(new Error(ErrorTypeEnum.enum.ORIGIN_IS_UNDEFINED));
      } else if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(ErrorTypeEnum.enum.ORIGIN_NOT_ALLOWED));
      }
    },
    credentials: true,
  };

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.get("Origin");
    if (origin == undefined && !allowedPathsWithoutOrigin.includes(req.path)) {
      throw new Error(ErrorTypeEnum.enum.ORIGIN_IS_UNDEFINED);
    }

    cors(corsOptions)(req, res, (err) => {
      if (err instanceof Error && err.message === ErrorTypeEnum.enum.ORIGIN_NOT_ALLOWED) {
        next(err);
      } else {
        next();
      }
    });

    cors(corsOptions);

    return;
  });
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
