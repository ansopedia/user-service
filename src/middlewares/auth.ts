import type { NextFunction, Request, Response } from "express";

import { AuthService } from "@/api/v1/auth/auth.service.js";
import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString } from "@/utils";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken: string | null = null;
    const authHeader = req.headers.authorization;

    // 1. Check Header (Mobile/CLI)
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      accessToken = extractTokenFromBearerString(authHeader);
    }
    // 2. Check Cookie (Web/Next.js)
    // Note: This REQUIRES 'cookie-parser' to be installed and used in app.ts
    else if (req.cookies != null && req.cookies["authorization"] != null) {
      accessToken = req.cookies["authorization"];
    }

    if (accessToken === null) {
      // It's helpful to know WHY it failed during debugging
      // console.debug('Auth failed: No token in Header or Cookie');
      throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);
    }

    res.locals.loggedInUser = await AuthService.verifyAccessToken(accessToken);
    next();
  } catch (error) {
    next(error);
  }
};
