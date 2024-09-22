import supertest, { Response } from "supertest";

import { app } from "@/app";
import { ErrorTypeEnum, STATUS_CODES, errorMap } from "@/constants";

import { success } from "../../api/v1/user/user.constant";
import { CreateUser } from "../../api/v1/user/user.validation";

export const expectBadRequestResponseForValidationError = (response: Response): void => {
  const errorObject = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body).toMatchObject({
    message: errorObject.body.message,
    code: errorObject.body.code,
  });
};

export const createUser = async (user: CreateUser, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/users").send(user).set("authorization", authorizationHeader);
};

export const expectUserCreationSuccess = (response: Response, user: CreateUser): void => {
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

  expect(body.user).not.toHaveProperty("password");
  expect(body.user).not.toHaveProperty("confirmPassword");
};

export const findUserByUsername = async (username: string): Promise<Response> => {
  return supertest(app).get(`/api/v1/users/${username}`);
};

export const expectUserNotFoundError = (response: Response): void => {
  const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];

  expect(response).toBeDefined();
  expect(response.statusCode).toBe(STATUS_CODES.NOT_FOUND);
  expect(response.body).toMatchObject({
    message: errorObject.body.message,
    code: errorObject.body.code,
    status: "failed",
  });
};

export const expectFindUserByUsernameSuccess = (response: Response, user: CreateUser): void => {
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

  expect(body.user).not.toHaveProperty("password");
  expect(body.user).not.toHaveProperty("confirmPassword");
};

export const deleteUser = async (userId: string, authorizationHeader: string): Promise<Response> => {
  return supertest(app).delete(`/api/v1/users/${userId}`).set("authorization", authorizationHeader);
};

export const expectDeleteUserSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  expect(body).toMatchObject({
    message: success.USER_DELETED_SUCCESSFULLY,
    user: { id: expect.any(String) },
  });

  expect(body.user).not.toHaveProperty("password");
  expect(body.user).not.toHaveProperty("confirmPassword");
};

export const restoreUser = async (userId: string, authorizationHeader: string): Promise<Response> => {
  return supertest(app).patch(`/api/v1/users/${userId}/restore`).set("authorization", authorizationHeader);
};

export const expectRestoreUserSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  expect(body).toMatchObject({
    message: success.USER_RESTORED_SUCCESSFULLY,
    user: { id: expect.any(String) },
  });

  expect(body.user).not.toHaveProperty("password");
  expect(body.user).not.toHaveProperty("confirmPassword");
};
