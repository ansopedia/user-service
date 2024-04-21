import { NextFunction, Response, Request } from 'express';

import { checkBearerToken, verifyToken } from '../utils/jwt.util';
import { ErrorTypeEnum } from '../constants/errorTypes.constant';

export const validateAccessToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader == null) throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const accessToken = checkBearerToken(authHeader);

    if (accessToken === false) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);

    const { userId } = verifyToken(accessToken);

    req.body.authUserId = userId;

    next();
  } catch (error) {
    next(error);
  }
};
