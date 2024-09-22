import { ErrorTypeEnum, STATUS_CODES, errorMap } from "@/constants";
import {
  createPermissionRequest,
  expectCreatePermissionSuccess,
  expectGetPermissionsSuccess,
  getPermissions,
} from "@/utils/test";

import { PermissionCategory, createPermission } from "../permission.validation";

const VALID_PERMISSION: createPermission = {
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

  it("should get all permissions", async () => {
    const response = await getPermissions();
    expectGetPermissionsSuccess(response);
  });
});
