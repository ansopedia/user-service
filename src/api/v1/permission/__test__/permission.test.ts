import { ErrorTypeEnum, STATUS_CODES, defaultUsers, errorMap } from "@/constants";
import {
  createPermissionRequest,
  expectCreatePermissionSuccess,
  expectGetPermissionsSuccess,
  expectLoginSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  getPermissionsRequest,
  login,
} from "@/utils/test";

import { CreatePermission, PermissionCategory } from "../permission.validation";

const VALID_PERMISSION: CreatePermission = {
  name: "create-permission",
  description: "this is crete permission creating first time",
  category: PermissionCategory.SYSTEM,
  isDeleted: false,
  createdBy: "65f6dac9156e93e7b6f1b88d",
};

const testInvalidPermissionField = async (field: string, value: string) => {
  const errorObj = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  const response = await createPermissionRequest({
    ...VALID_PERMISSION,
    [field]: value,
  });

  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body.message).toBe(errorObj.body.message);
  expect(response.body.code).toBe(errorObj.body.code);
};

describe("Permission Service", () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should create a new permission", async () => {
    const response = await createPermissionRequest(VALID_PERMISSION);
    expectCreatePermissionSuccess(response, VALID_PERMISSION);
  });

  it("should respond with 409 for duplicate permission", async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.PERMISSION_ALREADY_EXISTS];
    const response = await createPermissionRequest(VALID_PERMISSION);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it("should respond with 400 for invalid permission name", async () => {
    await testInvalidPermissionField("name", "a");
  });

  it("should respond with 400 for invalid permission description", async () => {
    await testInvalidPermissionField("description", "a");
  });

  it("should respond with 400 for invalid createdBy", async () => {
    await testInvalidPermissionField("createdBy", "a");
  });

  it("should not get all permissions without authorization header", async () => {
    const response = await getPermissionsRequest("");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("should not get all permissions with invalid authorization header", async () => {
    const response = await getPermissionsRequest("invalid");
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  it("should get all permissions", async () => {
    const response = await getPermissionsRequest(authorizationHeader);
    expectGetPermissionsSuccess(response);
  });
});
