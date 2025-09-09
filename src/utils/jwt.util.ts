import jwt from "jsonwebtoken";

import {
  type AccessTokenPayload,
  type ActionTokenPayload,
  type RefreshTokenPayload,
  validateActionTokenPayload,
  validateRefreshTokenPayload,
} from "@/api/v1/auth/auth.validation.js";
import { CURRENT_SERVICE, ErrorTypeEnum, ServiceEnum, envConstants } from "@/constants";
import { Tokens } from "@/types";

import { CryptoUtil } from "./crypto.util.js";
import { errorLogger } from "./logger.js";

const { ACTION_TOKEN_SECRET } = envConstants;

export const generateAccessToken = (payload: Omit<AccessTokenPayload, "issuer" | "audience">): string => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  const accessToken: AccessTokenPayload = {
    userId: payload.userId,
    deviceId: payload.deviceId,
    permissions: payload.permissions,
    tokenVersion: payload.tokenVersion,
  };

  try {
    return jwt.sign(accessToken, privateKey, {
      algorithm: "RS256",
      expiresIn: envConstants.ACCESS_TOKEN_EXPIRES_IN,
      audience: CURRENT_SERVICE,
      issuer: CURRENT_SERVICE,
      jwtid: crypto.randomUUID(),
    });
  } catch (error) {
    errorLogger.error(`Access token generation error: ${error}`);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const privateKey = cryptoUtil.getPrivateKey();
    const refreshTokenPayload = validateRefreshTokenPayload(payload);

    return jwt.sign(refreshTokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: envConstants.REFRESH_TOKEN_EXPIRES_IN,
      audience: CURRENT_SERVICE,
      issuer: CURRENT_SERVICE,
      jwtid: crypto.randomUUID(),
    });
  } catch (error) {
    errorLogger.error(`Refresh token generation error: ${error}`);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const generateActionToken = (payload: ActionTokenPayload) => {
  const actionTokenPayload = validateActionTokenPayload(payload);

  return jwt.sign(actionTokenPayload, ACTION_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: envConstants.ACTION_TOKEN_EXPIRES_IN,
    audience: CURRENT_SERVICE,
    issuer: CURRENT_SERVICE,
  });
};

export const verifyJWTToken = async <T>(
  token: string,
  tokenType: Tokens,
  serviceName: ServiceEnum = CURRENT_SERVICE
): Promise<T & jwt.JwtPayload> => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const publicKey = cryptoUtil.getPublicKey();

    const secret = tokenType === Tokens.ACTION ? ACTION_TOKEN_SECRET : publicKey;
    const algorithm: jwt.Algorithm = tokenType === Tokens.ACTION ? "HS256" : "RS256";

    const verifyOptions: jwt.VerifyOptions = {
      algorithms: [algorithm],
      audience: serviceName,
      issuer: CURRENT_SERVICE,
    };

    const verifiedToken = jwt.verify(token, secret, verifyOptions) as T & jwt.JwtPayload;

    return verifiedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.message.includes("audience")) {
        throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN_AUDIENCE);
      }
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_NOT_ACTIVE);
    }
    throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
  }
};

export const extractTokenFromBearerString = (bearerToken: string): string => {
  const [bearer, token] = bearerToken.split(" ");
  if (bearer !== "Bearer" || !token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
  return token;
};
