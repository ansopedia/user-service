import type { CreateRole, MongooseObjectId, Role } from "@ansospace/types";

import { RoleModel } from "./role.model.js";

export class RoleDAL {
  static async createRole(userData: CreateRole): Promise<Role> {
    const newRole = new RoleModel({
      ...userData,
      updatedBy: userData.createdBy,
    });
    return await newRole.save();
  }

  static async createRoles(roles: CreateRole[]): Promise<Role[]> {
    return await RoleModel.insertMany(roles.map((role) => ({ ...role, updatedBy: role.createdBy })));
  }

  static async getRoles(): Promise<Role[]> {
    return await RoleModel.find({ isDeleted: false });
  }

  static async getRoleByName(name: string): Promise<Role | null> {
    return await RoleModel.findOne({ name });
  }

  static async softDeleteRole(roleId: MongooseObjectId): Promise<Role | null> {
    return await RoleModel.findByIdAndUpdate(roleId, { isDeleted: true }, { new: true });
  }

  static async restoreRole(roleId: MongooseObjectId): Promise<Role | null> {
    return await RoleModel.findByIdAndUpdate(roleId, { isDeleted: false }, { new: true });
  }
}
