import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConstants } from '../constants';
import { JwtToken, jwtTokenSchema } from '../api/v1/auth/auth.validation';
import { ErrorTypeEnum } from '../constants/errorTypes.constant';

const { JWT_SECRET } = envConstants;

export const generateAccessToken = (payload: JwtToken) => {
  const validPayload = jwtTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: JwtToken) => {
  const validPayload = jwtTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    return verifiedToken as JwtPayload;
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
