import type { ObjectId, Permission, Role } from "@ansospace/types";

import { PermissionDAL } from "@/api/v1/permission/permission.dal.js";
import { RoleDAL } from "@/api/v1/role/role.dal.js";
import { RoleService } from "@/api/v1/role/role.service.js";
import { UserService } from "@/api/v1/user/user.service.js";
import { ROLES, defaultPermissions, defaultRolePermissions, defaultRoles, defaultUsers } from "@/constants";
import { errorLogger } from "@/utils";

export const setupInitialRolesAndPermissions = async () => {
  let permissions: Permission[] = [];
  let roles: Role[] = [];

  try {
    permissions = await PermissionDAL.createPermissions(defaultPermissions);
  } catch (error) {
    errorLogger.error(`failed to create permission =  ${error}`);
  }

  try {
    roles = await RoleDAL.createRoles(defaultRoles);
  } catch (error) {
    errorLogger.error(`failed to create roles =  ${error}`);
  }

  Object.keys(defaultRolePermissions).forEach(async (roleName) => {
    const role = roles.find((role) => role.name === roleName);
    if (!role) {
      errorLogger.error(`Role not found for: roleName =  ${roleName}`);
      return;
    }

    const permissionIds = defaultRolePermissions[roleName]
      .map((permName) => permissions.find((p) => p.name === permName)?.id)
      .filter((id): id is ObjectId => Boolean(id));

    try {
      await new RoleService().createRolePermission({
        roleId: role.id,
        permissionIds,
      });
    } catch (error) {
      errorLogger.error(`Role permission already exists for roleName = ${roleName}, error = ${error}`);
    }
  });
};

export const setupInitialUserRole = async () => {
  try {
    const roleService = new RoleService();
    const user = await UserService.registerUser(defaultUsers);

    const roles = await roleService.getRoles();

    const role = roles.find((role) => role.name === ROLES.SUPER_ADMIN);

    if (!role) {
      errorLogger.error(`Role not found for: roleName =  ${ROLES.SUPER_ADMIN}`);
      return;
    }

    await UserService.assignRolesToUser({ userId: user.id, roleIds: [role.id] });
  } catch (error) {
    errorLogger.error(`Error while creating user role: error = ${error}`);
  }
};
