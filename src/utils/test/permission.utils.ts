import supertest, { Response } from "supertest";

import { success } from "@/api/v1/permission/permission.constant";
import { CreatePermission } from "@/api/v1/permission/permission.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

export const createPermissionRequest = async (permission: CreatePermission): Promise<Response> => {
  return await supertest(app).post("/api/v1/permissions").send(permission);
};

export const expectCreatePermissionSuccess = (response: Response, permission: CreatePermission): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.PERMISSION_CREATED_SUCCESSFULLY,
    data: {
      permission: {
        id: expect.any(String),
        name: permission.name,
        description: permission.description,
        category: permission.category,
      },
    },
  });
};

export const getPermissionsRequest = async (authorizationHeader: string): Promise<Response> => {
  return await supertest(app).get("/api/v1/permissions").set("Authorization", authorizationHeader);
};

export const expectGetPermissionsSuccess = (response: Response): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PERMISSION_FETCHED_SUCCESSFULLY,
    data: {
      permissions: expect.any(Array),
    },
  });
};
