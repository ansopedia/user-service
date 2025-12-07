import { type CreateRole, type GetPermission } from "@ansospace/types";
import mongoose from "mongoose";

import { defaultUsers } from "@/constants";
import {
  createRolePermissionRequest,
  createRoleRequest,
  expectCreateRolePermissionSuccess,
  expectCreateRoleSuccess,
  expectGetPermissionsSuccess,
  expectLoginSuccess,
  getPermissionsRequest,
  login,
} from "@/utils/test";

const VALID_ROLE: CreateRole = {
  name: "new-role",
  description: "this is super admin creating first time",
  createdBy: new mongoose.Types.ObjectId(),
  isDeleted: false,
  isSystemRole: false,
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

    const permissionResponse = await getPermissionsRequest(authorizationHeader);
    expectGetPermissionsSuccess(permissionResponse);

    const allPermissions: GetPermission[] = permissionResponse.body.data.permissions;

    const rolePermission = {
      roleId: roleResponse.body.data.role.id,
      permissionIds: allPermissions.map((perm) => perm.id),
    };

    const response = await createRolePermissionRequest(rolePermission, authorizationHeader);
    expectCreateRolePermissionSuccess(response);
  });
});
