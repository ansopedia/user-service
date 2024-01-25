import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { sendApiResponse } from '../utils/sendApiResponse';

export const handleValidationErrors = (req: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendApiResponse({
      response,
      statusCode: 422,
      message: 'Validation error',
      payload: { errors: errors.array() },
    });
    return;
  }
  next();
};
