import type { RolePermission } from "@ansospace/types";

import { RolePermissionModel } from "./role-permission.model.js";

export class RolePermissionDAL {
  static async createRolePermission(rolePermissionData: RolePermission) {
    const rolePermission = await RolePermissionModel.create(rolePermissionData);
    return rolePermission.save();
  }

  static async exists(rolePermissionData: RolePermission) {
    return await RolePermissionModel.exists(rolePermissionData);
  }
}
