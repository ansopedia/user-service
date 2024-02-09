import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { isBearerToken, verifyToken } from '../utils/jwt-token';
import { sendApiResponse } from '../utils/sendApiResponse';
import {
  AUTHENTICATION_TOKEN_MISSING_ERROR,
  MISSING_BEARER_TOKEN,
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
    const [bearerToken, accessToken] =
      req.headers.authorization?.split(' ') ?? [];

    if (!isBearerToken(bearerToken)) {
      return sendApiResponse({
        response,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: MISSING_BEARER_TOKEN,
      });
    }

    if (!accessToken) {
      return sendApiResponse({
        response,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: AUTHENTICATION_TOKEN_MISSING_ERROR,
      });
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
    const [bearerToken, refreshToken] =
      request.headers.authorization?.split(' ') ?? [];

    if (!isBearerToken(bearerToken)) {
      return sendApiResponse({
        response,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: MISSING_BEARER_TOKEN,
      });
    }

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
