import { RolePermissionModel } from './role-permission.model';
import { RolePermission } from './role-permission.validation';

export class RolePermissionDAL {
  static async createRolePermission(rolePermissionData: RolePermission) {
    const rolePermission = await RolePermissionModel.create(rolePermissionData);
    return rolePermission.save();
  }

  static async exists(rolePermissionData: RolePermission) {
    return RolePermissionModel.exists(rolePermissionData);
  }
}
