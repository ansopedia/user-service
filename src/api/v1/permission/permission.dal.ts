import type { CreatePermission, Permission } from "@ansospace/types";
import mongoose from "mongoose";

import { PermissionModel } from "./permission.model.js";

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

  static async getPermissionsByUserId(userId: mongoose.Types.ObjectId): Promise<Permission[]> {
    return await PermissionModel.aggregate([
      {
        $lookup: {
          from: "rolepermissions",
          localField: "_id",
          foreignField: "permissionId",
          as: "rolePermissions",
        },
      },
      {
        $unwind: "$rolePermissions",
      },
      {
        $lookup: {
          from: "userroles",
          localField: "rolePermissions.roleId",
          foreignField: "roleId",
          as: "userRoles",
        },
      },
      {
        $unwind: "$userRoles",
      },
      {
        $match: {
          "userRoles.userId": userId,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          category: 1,
          createdBy: 1,
          updatedBy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
