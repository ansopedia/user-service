import jwt from "jsonwebtoken";

import {
  JwtActionToken,
  JwtRefreshToken,
  jwtAccessTokenSchema,
  jwtActionTokenSchema,
  jwtRefreshTokenSchema,
} from "@/api/v1/auth/auth.validation";
import {
  ACTION_TOKEN_EXPIRY_TIME,
  CURRENT_SERVICE,
  ErrorTypeEnum,
  Permission,
  ServiceEnum,
  envConstants,
} from "@/constants";
import { Tokens } from "@/types";

import { CryptoUtil } from "./crypto.util";
import { errorLogger } from "./logger";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_FOR_ACTION_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
  refresh: JWT_REFRESH_SECRET,
  action: JWT_TOKEN_FOR_ACTION_SECRET,
};

export const generateAccessToken = (payload: { userId: string; permissions: Permission[] }): string => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  try {
    const tokenPayload = jwtAccessTokenSchema.parse({
      userId: payload.userId,
      permissions: payload.permissions,
      tokenVersion: 1,
      issuer: CURRENT_SERVICE,
      audience: CURRENT_SERVICE,
    });

    return jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      audience: CURRENT_SERVICE,
      issuer: CURRENT_SERVICE,
      jwtid: crypto.randomUUID(),
    });
  } catch (error) {
    errorLogger.error(`Access token generation error: ${error}`);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const generateRefreshToken = (payload: JwtRefreshToken): string => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const privateKey = cryptoUtil.getPrivateKey();

    const validPayload = jwtRefreshTokenSchema.parse(payload);

    return jwt.sign(validPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
      audience: CURRENT_SERVICE,
      issuer: CURRENT_SERVICE,
      jwtid: crypto.randomUUID(),
    });
  } catch (error) {
    errorLogger.error(`Refrest token generation error: ${error}`);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const generateTokenForAction = (payload: JwtActionToken) => {
  const validPayload = jwtActionTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_TOKEN_FOR_ACTION_SECRET, {
    expiresIn: ACTION_TOKEN_EXPIRY_TIME,
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

    const secret = tokenType === Tokens.ACTION ? JWT_TOKEN_FOR_ACTION_SECRET : publicKey;
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
