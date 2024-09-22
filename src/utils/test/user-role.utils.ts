import supertest, { Response } from "supertest";

import { success } from "@/api/v1/userRole/user-role.constant";
import { UserRole } from "@/api/v1/userRole/user-role.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

export const createUserRoleRequest = async (userRole: UserRole, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/user-role").send(userRole).set("authorization", authorizationHeader);
};

export const expectCreateUserRoleSuccess = (response: Response, { roleId, userId }: UserRole): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.USER_ROLE_CREATED_SUCCESSFULLY,
    userRole: {
      roleId,
      userId,
    },
  });
};
