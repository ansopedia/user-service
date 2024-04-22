import { NextFunction, Response, Request } from 'express';
import { checkBearerToken, verifyToken } from '../utils/jwt.util';
import { ErrorTypeEnum } from '../constants/errorTypes.constant';
import { UserService } from '../api/v1/user/user.service';
import { JwtAccessToken, JwtRefreshToken } from '../api/v1/auth/auth.validation';

const parseUser = async (req: Request, _: Response, next: NextFunction, tokenType: 'access' | 'refresh') => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader == null) throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = checkBearerToken(authHeader);

    if (token === false) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);

    let user;
    if (tokenType === 'refresh') {
      const { id }: JwtRefreshToken = verifyToken<JwtRefreshToken>(token, tokenType);
      user = await UserService.getUserById(id);
    } else {
      const { userId } = verifyToken<JwtAccessToken>(token, tokenType);
      user = await UserService.getUserById(userId);
    }

    req.body.authUser = user;

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
