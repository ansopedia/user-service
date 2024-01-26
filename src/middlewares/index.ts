import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { verifyToken } from '../utils/jwt-token';
import { sendApiResponse } from '../utils/sendApiResponse';
import {
  AUTHENTICATION_TOKEN_MISSING_ERROR,
  STATUS_CODES,
  UNAUTHORIZED_ERROR,
} from '../constants';
import { JwtPayload } from 'jsonwebtoken';

export const handleValidationErrors = (
  req: Request,
  response: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendApiResponse({
      response,
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: 'Validation error',
      payload: { errors: errors.array() },
    });
    return;
  }
  next();
};

export const verifyAccessToken = async (
  req: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: AUTHENTICATION_TOKEN_MISSING_ERROR,
      });
      return;
    }

    const decodedToken: JwtPayload = verifyToken(accessToken);
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    sendApiResponse({
      response,
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: UNAUTHORIZED_ERROR,
      errors: error as Error,
    });
  }
};
