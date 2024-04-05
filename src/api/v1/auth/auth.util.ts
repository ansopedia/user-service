import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConstants } from '../../../constants';
import { JwtToken, jwtTokenSchema } from './auth.validation';

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
  const verifiedToken = jwt.verify(token, JWT_SECRET);
  return verifiedToken as JwtPayload;
};

export const checkBearerToken = (bearerToken: string): string | null => {
  const [bearer, token] = bearerToken.split(' ');
  return bearer === 'Bearer' ? token : null;
};
