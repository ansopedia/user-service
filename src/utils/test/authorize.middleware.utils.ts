import { Response } from 'supertest';
import { errorMap, ErrorTypeEnum, STATUS_CODES } from '@/constants';

export const expectUnauthorizedResponseForMissingAuthorizationHeader = async (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.NO_AUTH_HEADER];

  expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
};

export const expectUnauthorizedResponseForInvalidAuthorizationHeader = async (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_ACCESS];

  expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
};

export const expectUnauthorizedResponseForInvalidToken = async (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_TOKEN];

  expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
};

export const expectUnauthorizedResponseWhenUserHasInsufficientPermission = async (response: Response) => {
  const errorObject = errorMap[ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION];

  expect(response.statusCode).toBe(STATUS_CODES.FORBIDDEN);
  expect(response.body.message).toBe(errorObject.body.message);
  expect(response.body.code).toBe(errorObject.body.code);
};
