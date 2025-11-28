import type { NextFunction, Request, Response } from "express";

import { AuthService } from "@/api/v1/auth/auth.service.js";
import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString } from "@/utils";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const accessToken = extractTokenFromBearerString(authHeader);

    res.locals.loggedInUser = await AuthService.verifyAccessToken(accessToken);
    next();
  } catch (error) {
    next(error);
  }
};
