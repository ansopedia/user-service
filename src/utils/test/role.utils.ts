import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/role/role.constant.js";
import type { createRole } from "@/api/v1/role/role.validation.js";
import { STATUS_CODES } from "@/constants";

import { app } from "../../app.js";

export const createRoleRequest = async (role: createRole, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/roles").send(role).set("authorization", authorizationHeader);
};

export const expectCreateRoleSuccess = (response: Response, { name, description }: createRole): void => {
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
