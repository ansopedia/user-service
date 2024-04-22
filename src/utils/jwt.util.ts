import jwt from 'jsonwebtoken';
import { envConstants } from '../constants';
import {
  JwtAccessToken,
  jwtAccessTokenSchema,
  JwtRefreshToken,
  jwtRefreshTokenSchema,
} from '../api/v1/auth/auth.validation';
import { ErrorTypeEnum } from '../constants/errorTypes.constant';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = envConstants;

export const generateAccessToken = (payload: JwtAccessToken) => {
  const validPayload = jwtAccessTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtRefreshToken) => {
  const validPayload = jwtRefreshTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = <T>(token: string, tokenType: 'access' | 'refresh'): T => {
  try {
    const verifiedToken = jwt.verify(token, tokenType === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET);
    return verifiedToken as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    } else {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    }
  }
};

export const checkBearerToken = (bearerToken: string): string | false => {
  const [bearer, token] = bearerToken.split(' ');
  return bearer === 'Bearer' ? token : false;
};
