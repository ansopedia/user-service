import { RolePermissionModel } from "./role-permission.model.js";
import type { RolePermission } from "./role-permission.validation.js";

export class RolePermissionDAL {
  static async createRolePermission(rolePermissionData: RolePermission) {
    const rolePermission = await RolePermissionModel.create(rolePermissionData);
    return rolePermission.save();
  }

  static async exists(rolePermissionData: RolePermission) {
    return await RolePermissionModel.exists(rolePermissionData);
  }
}
