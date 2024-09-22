import { PermissionCategory, createPermission } from "@/api/v1/permission/permission.validation";
import { createRole } from "@/api/v1/role/role.validation";
import { defaultUsers } from "@/constants";
import {
  createPermissionRequest,
  createRolePermissionRequest,
  createRoleRequest,
  expectCreatePermissionSuccess,
  expectCreateRolePermissionSuccess,
  expectCreateRoleSuccess,
  expectLoginSuccess,
  login,
} from "@/utils/test";

const VALID_ROLE: createRole = {
  name: "new-role",
  description: "this is super admin creating first time",
  createdBy: "65f6dac9156e93e7b6f1b88d",
  isDeleted: false,
  isSystemRole: false,
};

const VALID_PERMISSION: createPermission = {
  name: "new-permissions",
  description: "this is crete permission creating first time",
  createdBy: "65f6dac9156e93e7b6f1b88d",
  isDeleted: false,
  category: PermissionCategory.SYSTEM,
};

describe("Role Permission Test", () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should create a new role permission", async () => {
    const roleResponse = await createRoleRequest(VALID_ROLE, authorizationHeader);
    expectCreateRoleSuccess(roleResponse, VALID_ROLE);

    const permissionRes = await createPermissionRequest(VALID_PERMISSION);
    expectCreatePermissionSuccess(permissionRes, VALID_PERMISSION);

    const rolePermission = {
      roleId: roleResponse.body.role.id,
      permissionId: permissionRes.body.permission.id,
    };

    const response = await createRolePermissionRequest(rolePermission, authorizationHeader);
    expectCreateRolePermissionSuccess(response, rolePermission);
  });
});
