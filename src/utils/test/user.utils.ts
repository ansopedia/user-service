import supertest, { Response } from 'supertest';
import { app } from '@/app';
import { errorMap, ErrorTypeEnum, STATUS_CODES } from '@/constants';
import { CreateUser } from '../../api/v1/user/user.validation';
import { success } from '../../api/v1/user/user.constant';

export const expectBadRequestResponseForValidationError = (response: Response): void => {
  const errorObject = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body).toMatchObject({
    message: errorObject.body.message,
    code: errorObject.body.code,
  });
};

export async function createUser(user: CreateUser, authorizationHeader: string): Promise<Response> {
  return supertest(app).post('/api/v1/users').send(user).set('authorization', authorizationHeader);
}

export function expectUserCreationSuccess(response: Response, user: CreateUser): void {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);
  expect(body).toMatchObject({
    message: success.USER_CREATED_SUCCESSFULLY,
    user: {
      id: expect.any(String),
      email: user.email,
      username: user.username,
    },
  });

  expect(body.user).not.toHaveProperty('password');
  expect(body.user).not.toHaveProperty('confirmPassword');
}

export async function findUserByUsername(username: string): Promise<Response> {
  return supertest(app).get(`/api/v1/users/${username}`);
}

export function expectUserNotFoundError(response: Response): void {
  const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];

  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.NOT_FOUND);
  expect(response.body).toMatchObject({
    message: errorObject.body.message,
    code: errorObject.body.code,
    status: 'failed',
  });
}

export function expectFindUserByUsernameSuccess(response: Response, user: CreateUser): void {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.USER_FETCHED_SUCCESSFULLY,
    user: {
      id: expect.any(String),
      email: user.email,
      username: user.username,
    },
  });

  expect(body.user).not.toHaveProperty('password');
  expect(body.user).not.toHaveProperty('confirmPassword');
}

export async function deleteUser(userId: string, authorizationHeader: string): Promise<Response> {
  return supertest(app).delete(`/api/v1/users/${userId}`).set('authorization', authorizationHeader);
}

export function expectDeleteUserSuccess(response: Response): void {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  expect(body).toMatchObject({
    message: success.USER_DELETED_SUCCESSFULLY,
    user: { id: expect.any(String) },
  });

  expect(body.user).not.toHaveProperty('password');
  expect(body.user).not.toHaveProperty('confirmPassword');
}

export async function restoreUser(userId: string, authorizationHeader: string): Promise<Response> {
  return supertest(app).patch(`/api/v1/users/${userId}/restore`).set('authorization', authorizationHeader);
}

export function expectRestoreUserSuccess(response: Response): void {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  expect(body).toMatchObject({
    message: success.USER_RESTORED_SUCCESSFULLY,
    user: { id: expect.any(String) },
  });

  expect(body.user).not.toHaveProperty('password');
  expect(body.user).not.toHaveProperty('confirmPassword');
}
