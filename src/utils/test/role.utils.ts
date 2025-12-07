import type { CreateRole } from "@ansospace/types";
import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/role/role.constant.js";
import { STATUS_CODES } from "@/constants";

import type { CreateRolePermissionDTO } from "../../api/v1/role/role.dto.js";
import { app } from "../../app.js";

export const createRoleRequest = async (role: CreateRole, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/roles").send(role).set("authorization", authorizationHeader);
};

export const expectCreateRoleSuccess = (response: Response, { name, description }: CreateRole): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.ROLE_CREATED_SUCCESSFULLY,
    data: {
      role: {
        id: expect.any(String),
        name,
        description,
      },
    },
  });
};

export const getRoles = async (authorizationHeader: string): Promise<Response> => {
  return await supertest(app).get("/api/v1/roles").set("authorization", authorizationHeader);
};

export const expectGetRolesSuccess = (response: Response): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.ROLES_FETCHED_SUCCESSFULLY,
    data: {
      roles: expect.any(Array),
    },
  });
};

export const createRolePermissionRequest = async (
  { roleId, permissionIds }: CreateRolePermissionDTO,
  authorizationHeader: string
) => {
  return await supertest(app)
    .post(`/api/v1/roles/${roleId}/permissions`)
    .send({ permissionIds })
    .set("authorization", authorizationHeader);
};

export const expectCreateRolePermissionSuccess = (response: Response): void => {
  expect(response).toBeDefined();
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);
  const { createdPermissions } = body.data;

  expect(body).toMatchObject({
    message: createdPermissions.length > 0 ? success.PERMISSION_ADDED_SUCCESSFULLY : success.PERMISSIONS_ALREADY_EXIST,
    data: {
      createdPermissions,
    },
  });
};
