import jwt from "jsonwebtoken";

import { AuthDAL } from "@/api/v1/auth/auth.dal";
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

import { logger } from ".";
import { CryptoUtil } from "./crypto.util";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_FOR_ACTION_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
  refresh: JWT_REFRESH_SECRET,
  action: JWT_TOKEN_FOR_ACTION_SECRET,
};

export const generateAccessToken = async (payload: { userId: string; permissions: Permission[] }): Promise<string> => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  try {
    const tokenPayload = jwtAccessTokenSchema.parse({
      userId: payload.userId,
      permissions: payload.permissions,
      tokenVersion: 1,
      issuedAt: Date.now(),
      issuer: CURRENT_SERVICE,
      audience: CURRENT_SERVICE,
    });

    return jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      audience: CURRENT_SERVICE,
      issuer: CURRENT_SERVICE,
    });
  } catch (error) {
    logger.error(`Access token generation error: ${error}`);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const generateRefreshToken = async (payload: JwtRefreshToken): Promise<string> => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  const validPayload = jwtRefreshTokenSchema.parse(payload);
  return jwt.sign(validPayload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
    audience: CURRENT_SERVICE,
    issuer: CURRENT_SERVICE,
  });
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
  tokenType: "access" | "refresh" | "action",
  serviceName: ServiceEnum = CURRENT_SERVICE
): Promise<T> => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const publicKey = cryptoUtil.getPublicKey();

    const secret = tokenType === "action" ? JWT_TOKEN_FOR_ACTION_SECRET : publicKey;
    const algorithm = tokenType === "action" ? "HS256" : "RS256";

    const verifyOptions = {
      algorithms: [algorithm] as jwt.Algorithm[],
      audience: serviceName,
      issuer: CURRENT_SERVICE,
    };

    const verifiedToken = jwt.verify(token, secret, verifyOptions) as T;

    if (tokenType === "refresh") {
      const storedToken = await AuthDAL.getAuthByRefreshToken(token);
      if (!storedToken) {
        throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
      }
    }

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
