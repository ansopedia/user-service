import jwt, { JwtPayload } from 'jsonwebtoken';

import { IUser } from '../models/User';
import { JWT_SECRET } from '../constants';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  const verifiedToken = jwt.verify(token, JWT_SECRET);
  return verifiedToken as JwtPayload;
};

export const generateAndSaveAuthTokens = async (
  user: IUser,
): Promise<{ refreshToken: string; accessToken: string }> => {
  const refreshToken = generateRefreshToken({ userId: user._id });
  const accessToken = generateAccessToken({ userId: user._id });

  // Remove old refresh tokens
  user.tokens = user.tokens.filter((token) => {
    try {
      verifyToken(token.accessToken);
      return true;
    } catch (err) {
      return false;
    }
  });

  user.tokens.push({ accessToken });
  await user.save();
  return { refreshToken, accessToken };
};
