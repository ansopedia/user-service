import { PermissionModel } from "./permission.model.js";
import type { CreatePermission, Permission } from "./permission.validation.js";

export class PermissionDAL {
  static async createPermission(permission: CreatePermission): Promise<Permission> {
    return await PermissionModel.create({
      ...permission,
      updatedBy: permission.createdBy,
    });
  }

  static async createPermissions(permission: CreatePermission[]): Promise<Permission[]> {
    return await PermissionModel.insertMany(
      permission.map((permission) => ({
        ...permission,
        updatedBy: permission.createdBy,
      }))
    );
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
