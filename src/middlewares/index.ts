import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { verifyToken } from '../utils/jwt-token';
import { sendApiResponse } from '../utils/sendApiResponse';
import {
  AUTHENTICATION_TOKEN_MISSING_ERROR,
  REFRESH_TOKEN_MISSING_ERROR,
  STATUS_CODES,
  UNAUTHORIZED_ERROR,
} from '../constants';

export const handleValidationErrors = (
  req: Request,
  response: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendApiResponse({
      response,
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: 'Validation error',
      payload: { errors: errors.array() },
    });
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

    const { userId } = verifyToken(accessToken);
    req.body.userId = userId;

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

export const verifyRefreshToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = request.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
      return sendApiResponse({
        response,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: REFRESH_TOKEN_MISSING_ERROR,
      });
    }

    const { userId } = verifyToken(refreshToken);
    request.body.userId = userId;

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
