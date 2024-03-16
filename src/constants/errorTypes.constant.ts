import { z } from 'zod';

const errorType = ['VALIDATION_ERROR', 'DUPLICATE_KEY_VALUE', 'INTERNAL_SERVER_ERROR', 'RESOURCE_NOT_FOUND'] as const;

export const ErrorTypeEnum = z.enum(errorType);

export const errorMap = {
  [ErrorTypeEnum.enum.VALIDATION_ERROR]: {
    httpStatusCode: 400,
    body: { code: 'validation_error', message: 'Validation failed' },
  },
  [ErrorTypeEnum.enum.DUPLICATE_KEY_VALUE]: {
    httpStatusCode: 409,
    body: { code: 'duplicate_key_value', message: 'Duplicate key value' },
  },
  [ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR]: {
    httpStatusCode: 500,
    body: { code: 'internal_server_error', message: 'Internal server error' },
  },
  [ErrorTypeEnum.enum.RESOURCE_NOT_FOUND]: {
    httpStatusCode: 404,
    body: { code: 'resource_not_found', message: 'Resource not found' },
  },
};

export type ErrorTypeEnum = z.infer<typeof ErrorTypeEnum>;

export const getErrorObject = (type: ErrorTypeEnum) => {
  const validateErrorType = ErrorTypeEnum.safeParse(type);
  return validateErrorType.success ? errorMap[type] : errorMap[ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR];
};
