import { PermissionModel } from './permission.model';
import { Permission, createPermission } from './permission.validation';

export class PermissionDAL {
  static async createPermission(permission: createPermission): Promise<Permission> {
    return await PermissionModel.create({ ...permission, updatedBy: permission.createdBy });
  }

  static async getPermissionByName(name: string): Promise<Permission | null> {
    return await PermissionModel.findOne({ name });
  }

  static async getPermissions(): Promise<Permission[]> {
    return await PermissionModel.find();
  }

  static async getPermissionsByIds(permissionIds: string[]) {
    return await PermissionModel.find({ _id: { $in: permissionIds } });
  }
}
