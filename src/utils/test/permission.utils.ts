import supertest, { type Response } from "supertest";

import { success } from "@/api/v1/permission/permission.constant.js";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

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
