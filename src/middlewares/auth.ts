import { NextFunction, Request, Response } from "express";

import { AuthService } from "@/api/v1/auth/auth.service";
import { Auth, JwtAccessToken, JwtRefreshToken } from "@/api/v1/auth/auth.validation";
import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString, verifyJWTToken } from "@/utils/jwt.util";

const parseUser = async (req: Request, _: Response, next: NextFunction, tokenType: "access" | "refresh") => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = extractTokenFromBearerString(authHeader);
    if (!token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);

    let user: Auth;
    try {
      if (tokenType === "refresh") {
        const { id } = await verifyJWTToken<JwtRefreshToken>(token, tokenType);
        user = await AuthService.verifyToken(id);
      } else {
        const { userId } = await verifyJWTToken<JwtAccessToken>(token, tokenType);
        user = await AuthService.verifyToken(userId);
      }
    } catch (error) {
      if (error instanceof Error) throw error;

      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    if (user === null) {
      throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);
    }

    req.body.loggedInUser = { ...user, userId: user.userId.toString() };
    next();
  } catch (error) {
    next(error);
  }
};

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, "access");
};

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, "refresh");
};

export const validateOtpToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, "access");
};
