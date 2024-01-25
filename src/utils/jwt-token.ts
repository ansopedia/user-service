import jwt from 'jsonwebtoken';

import { IUser } from '../models/User';
import { JWT_SECRET } from '../constants';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15' });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateAndStoreAuthTokens = (
  user: IUser,
): { refreshToken: string; accessToken: string } => {
  const refreshToken = generateRefreshToken({ _id: user._id });
  const accessToken = generateAccessToken({ _id: user._id });
  user.tokens.push({ accessToken });
  return { refreshToken, accessToken };
};
