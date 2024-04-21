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
  'ROLE_NOT_FOUND',
  'USER_NOT_FOUND',
  'PERMISSION_ALREADY_EXISTS',
  'PERMISSION_NOT_FOUND',
  'ROLE_PERMISSION_ALREADY_EXISTS',
  'USER_ROLE_ALREADY_EXISTS',
  'INVALID_CREDENTIALS',
  'UNAUTHORIZED',
  'NO_AUTH_HEADER',
  'INVALID_ACCESS',
  'TOKEN_EXPIRED',
  'INVALID_TOKEN',
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
  [ErrorTypeEnum.enum.ROLE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: 'role_not_found', message: 'Role not found' },
  },
  [ErrorTypeEnum.enum.USER_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: 'user_not_found', message: 'User not found' },
  },
  [ErrorTypeEnum.enum.PERMISSION_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_permission', message: 'Permission already exists. Please choose a different permission.' },
  },
  [ErrorTypeEnum.enum.PERMISSION_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: 'permission_not_found', message: 'Permission not found' },
  },
  [ErrorTypeEnum.enum.ROLE_PERMISSION_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_role_permission', message: 'Role and permission combination already exists' },
  },
  [ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: 'duplicate_user_role', message: 'User and role combination already exists' },
  },
  [ErrorTypeEnum.enum.INVALID_CREDENTIALS]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'invalid_credentials', message: 'Invalid credentials' },
  },
  [ErrorTypeEnum.enum.UNAUTHORIZED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'unauthorized', message: 'Unauthorized' },
  },
  [ErrorTypeEnum.enum.NO_AUTH_HEADER]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'no_auth_header', message: 'No authorization header' },
  },
  [ErrorTypeEnum.enum.INVALID_ACCESS]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'invalid_access', message: 'Invalid access' },
  },
  [ErrorTypeEnum.enum.TOKEN_EXPIRED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'token_expired', message: 'Token expired' },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: 'invalid_token', message: 'Invalid token' },
  },
};

export type ErrorTypeEnum = z.infer<typeof ErrorTypeEnum>;

export const getErrorObject = (type: ErrorTypeEnum) => {
  const validateErrorType = ErrorTypeEnum.safeParse(type);
  return validateErrorType.success ? errorMap[type] : errorMap[ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR];
};
