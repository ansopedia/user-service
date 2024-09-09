import { NextFunction, Response, Request } from 'express';
import { extractTokenFromBearerString, verifyToken } from '@/utils/jwt.util';
import { ErrorTypeEnum } from '@/constants';
import { Auth, JwtAccessToken, JwtRefreshToken } from '@/api/v1/auth/auth.validation';
import { AuthService } from '@/api/v1/auth/auth.service';

const parseUser = async (req: Request, _: Response, next: NextFunction, tokenType: 'access' | 'refresh') => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader == null || authHeader === '') throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = extractTokenFromBearerString(authHeader);
    let user: Auth;

    if (tokenType === 'refresh') {
      const { id }: JwtRefreshToken = await verifyToken<JwtRefreshToken>(token, tokenType);
      user = await AuthService.verifyToken(id);
    } else {
      const { userId }: JwtAccessToken = await verifyToken<JwtAccessToken>(token, tokenType);
      user = await AuthService.verifyToken(userId);
    }

    req.body.loggedInUser = { ...user, userId: user.userId.toString() };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, 'access');
};

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, 'refresh');
};

export const validateOtpToken = async (req: Request, res: Response, next: NextFunction) => {
  return parseUser(req, res, next, 'access');
};
