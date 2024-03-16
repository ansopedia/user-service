import { NextFunction, Request, Response } from 'express';
import { ErrorTypeEnum, getErrorObject } from '../constants/errorTypes.constant';
import { sendResponse } from '../utils/sendResponse.util';

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err.message) {
    const errorObj = getErrorObject(err.message as unknown as ErrorTypeEnum);
    sendResponse({
      status: 'failed',
      response: res,
      statusCode: errorObj.httpStatusCode,
      message: errorObj.body.message,
      errorDetails: err,
      payload: {
        code: errorObj.body.code,
      },
    });
    next();
  }
};
