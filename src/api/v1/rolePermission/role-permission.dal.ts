import { RolePermissionModel } from './role-permission.model';
import { RolePermission } from './role-permission.validation';

export class RolePermissionDAL {
  static async createRolePermission(rolePermissionData: RolePermission) {
    const rolePermission = await RolePermissionModel.create(rolePermissionData);
    return rolePermission.save();
  }

  static async exists(rolePermissionData: RolePermission) {
    return await RolePermissionModel.exists(rolePermissionData);
  }

  static async getPermissionsByRoleIds(roleIds: string[]) {
    return await RolePermissionModel.find({ roleId: { $in: roleIds } });
  }
}
