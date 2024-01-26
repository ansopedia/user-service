import jwt, { JwtPayload } from 'jsonwebtoken';

import { IUser } from '../models/User';
import { JWT_SECRET } from '../constants';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  const verifiedToken = jwt.verify(token, JWT_SECRET);
  return verifiedToken as JwtPayload;
};

export const generateAndStoreAuthTokens = (
  user: IUser,
): { refreshToken: string; accessToken: string } => {
  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id });
  user.tokens.push({ accessToken: `Bearer ${accessToken}` });
  return {
    refreshToken: `Bearer ${refreshToken}`,
    accessToken: `Bearer ${accessToken}`,
  };
};
