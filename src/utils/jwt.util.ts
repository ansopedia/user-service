import jwt from 'jsonwebtoken';
import { envConstants, ErrorTypeEnum } from '@/constants';
import {
  JwtAccessToken,
  jwtAccessTokenSchema,
  JwtRefreshToken,
  jwtRefreshTokenSchema,
} from '@/api/v1/auth/auth.validation';
import { AuthDAL } from '../api/v1/auth/auth.dal';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = envConstants;

export const generateAccessToken = (payload: JwtAccessToken) => {
  const validPayload = jwtAccessTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtRefreshToken) => {
  const validPayload = jwtRefreshTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = async <T>(token: string, tokenType: 'access' | 'refresh'): Promise<T> => {
  try {
    const verifiedToken = jwt.verify(token, tokenType === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET);

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
