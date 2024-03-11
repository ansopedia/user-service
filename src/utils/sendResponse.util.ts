import { Response, request } from 'express';
import logger from './Logger';
import { envConstants } from '../constants';

export type SendResponse<T> = {
  response: Response;
  statusCode: number;
  status?: 'success' | 'failed';
  message: string;
  errorDetails?: Error;
  payload?: T;
};

export const sendResponse = <T>(data: SendResponse<T>) => {
  const { response, statusCode, message, errorDetails, payload, status = 'success' } = data;
  const isProduction = envConstants.NODE_ENV === 'production';
  const responseBody: Record<string, unknown> = { message };

  if (!isProduction && errorDetails) {
    responseBody.errorDetails = {
      message: errorDetails.message,
      stack: errorDetails.stack,
    };
  }

  Object.assign(responseBody, payload);

  if (errorDetails && statusCode === 500) {
    logger.error(
      `Error occurred in ${request.url}: ${errorDetails.name} ${errorDetails.message} ${errorDetails.stack}`,
    );
  }

  response.status(statusCode).json({ responseBody, status });
};
