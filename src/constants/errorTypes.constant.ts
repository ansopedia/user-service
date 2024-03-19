import { z } from 'zod';
import { STATUS_CODES } from './statusCode.constant';

const errorType = [
  'VALIDATION_ERROR',
  'DUPLICATE_KEY_VALUE',
  'INTERNAL_SERVER_ERROR',
  'RESOURCE_NOT_FOUND',
  'EMAIL_ALREADY_EXISTS',
  'USER_NAME_ALREADY_EXISTS',
  'ROLE_ALREADY_EXISTS',
  'USER_NOT_FOUND',
] as const;

export const ErrorTypeEnum = z.enum(errorType);

export const errorMap = {
  [ErrorTypeEnum.enum.VALIDATION_ERROR]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: { code: 'validation_error', message: 'Validation failed' },
  },
  [ErrorTypeEnum.enum.DUPLICATE_KEY_VALUE]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_key_value', message: 'Duplicate key value' },
  },
  [ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR]: {
    httpStatusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    body: { code: 'internal_server_error', message: 'Internal server error' },
  },
  [ErrorTypeEnum.enum.RESOURCE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: 'resource_not_found', message: 'Resource not found' },
  },
  [ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_email', message: 'Email already exists. Please choose a different email.' },
  },
  [ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_username', message: 'Username already exists. Please choose a different username.' },
  },
  [ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_role', message: 'Role already exists. Please choose a different role.' },
  },
  [ErrorTypeEnum.enum.USER_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: 'user_not_found', message: 'User not found' },
  },
};

export type ErrorTypeEnum = z.infer<typeof ErrorTypeEnum>;

export const getErrorObject = (type: ErrorTypeEnum) => {
  const validateErrorType = ErrorTypeEnum.safeParse(type);
  return validateErrorType.success ? errorMap[type] : errorMap[ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR];
};
