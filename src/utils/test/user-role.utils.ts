import type { UserRole } from "@ansospace/types";
import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/userRole/user-role.constant.js";
import { STATUS_CODES } from "@/constants";

import { app } from "../../app.js";

export const createUserRoleRequest = async (userRole: UserRole, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/user-role").send(userRole).set("authorization", authorizationHeader);
};

export const expectCreateUserRoleSuccess = (response: Response, { roleId, userId }: UserRole): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.USER_ROLE_CREATED_SUCCESSFULLY,
    data: {
      userRole: {
        roleId,
        userId,
      },
    },
  });
};
