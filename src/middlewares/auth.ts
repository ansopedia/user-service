import { NextFunction, Response, Request } from 'express';
import { checkBearerToken, verifyToken } from '../utils/jwt.util';
import { ErrorTypeEnum } from '../constants/errorTypes.constant';
import { UserService } from '../api/v1/user/user.service';

const validateToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader == null) throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = checkBearerToken(authHeader);

    if (token === false) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);

    const { userId } = verifyToken(token);

    const user = await UserService.getUserById(userId);

    req.body.authUser = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  return validateToken(req, res, next);
};

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  return validateToken(req, res, next);
};
