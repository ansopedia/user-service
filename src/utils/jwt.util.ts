import jwt from 'jsonwebtoken';
import { envConstants, ErrorTypeEnum } from '@/constants';
import {
  JwtAccessToken,
  jwtAccessTokenSchema,
  JwtActionToken,
  jwtActionTokenSchema,
  JwtRefreshToken,
  jwtRefreshTokenSchema,
} from '@/api/v1/auth/auth.validation';
import { AuthDAL } from '@/api/v1/auth/auth.dal';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_FOR_ACTION_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
  refresh: JWT_REFRESH_SECRET,
  action: JWT_TOKEN_FOR_ACTION_SECRET,
};

export const generateAccessToken = (payload: JwtAccessToken) => {
  const validPayload = jwtAccessTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtRefreshToken) => {
  const validPayload = jwtRefreshTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const generateTokenForAction = (payload: JwtActionToken) => {
  const validPayload = jwtActionTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_TOKEN_FOR_ACTION_SECRET, { expiresIn: '5m' });
};

export const verifyJWTToken = async <T>(token: string, tokenType: 'access' | 'refresh' | 'action'): Promise<T> => {
  try {
    const secret = tokenSecrets[tokenType];

    if (!secret) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }

    const verifiedToken = jwt.verify(token, secret);

    // TODO: move fetch token details to AuthService
    // Security: Invalidate the refresh token after it's used to obtain a new access token,
    // to prevent token reuse attacks and ensure that only the intended user can access the system.
    if (tokenType === 'refresh') {
      const storedToken = await AuthDAL.getAuthByRefreshToken(token);
      if (!storedToken) {
        throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
      }
    }

    return verifiedToken as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    } else {
      throw error;
    }
  }
};

export const extractTokenFromBearerString = (bearerToken: string): string => {
  const [bearer, token] = bearerToken.split(' ');
  if (bearer !== 'Bearer' || !token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
  return token;
};
