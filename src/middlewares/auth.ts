import { NextFunction, Request, Response } from "express";

import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString } from "@/utils/jwt.util";

import { AuthService } from "../api/v1/auth/auth.service";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = extractTokenFromBearerString(authHeader);

    res.locals.loggedInUser = await AuthService.verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
};
