import { PermissionModel } from './permission.model';
import { Permission, createPermission } from './permission.validation';

export class PermissionDAL {
  static async createPermission(permission: createPermission): Promise<Permission> {
    const createdPermission = await PermissionModel.create(permission);
    return createdPermission;
  }

  static async getPermissionByName(name: string): Promise<Permission | null> {
    const permission = await PermissionModel.findOne({ name });
    return permission;
  }
}
