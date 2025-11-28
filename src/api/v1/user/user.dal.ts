import type {
  LoginRequest,
  ObjectId,
  RegisterRequest,
  UpdateUser,
  User,
  UserRolePermission,
  Username,
} from "@ansospace/types";
import mongoose from "mongoose";

// import type { ObjectId, Username } from "@/types";
import { hashPassword } from "@/utils";

import { UserModel } from "./user.model.js";

// import type { RegisterSchema, UpdateUser, User, UserRolePermission } from "./user.validation.js";

export class UserDAL {
  static async createUser(userData: RegisterRequest): Promise<User> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }

  static async getAllUsers(limit: number, offset: number): Promise<{ users: User[]; totalUsers: number }> {
    const users = await UserModel.find({ isDeleted: false }).skip(offset).limit(limit).exec();
    const totalUsers = await UserModel.countDocuments({ isDeleted: false });
    return { users, totalUsers };
  }

  static async getUser(loginData: LoginRequest): Promise<User | null> {
    const identifier = "email" in loginData ? loginData.email : loginData.username;
    return await UserDAL.getUserByEmailOrUsername(identifier as string);
  }

  static async getUserByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }

  static async getUserByEmail(emailOrUsername: string): Promise<User | null> {
    return await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }

  static async getUserByUsername(username: Username): Promise<User | null> {
    return await UserModel.findOne({ username, isDeleted: false });
  }

  static async getUserById(userId: ObjectId): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  static async getUserByGoogleId(googleId: string): Promise<User | null> {
    return await UserModel.findOne({ googleId });
  }

  static async softDeleteUser(userId: ObjectId): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  }

  static async restoreUser(userId: ObjectId): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: false }, { new: true });
  }

  static async updateUser(userId: ObjectId, userData: UpdateUser): Promise<User | null> {
    if (userData.password !== null && userData.password !== undefined) {
      userData.password = await hashPassword(userData.password);
    }
    return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
  }

  static async getUserRolesAndPermissionsByUserId(userId: ObjectId): Promise<UserRolePermission> {
    const userRolePermissions = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userroles",
          localField: "_id",
          foreignField: "userId",
          as: "userRoles",
          pipeline: [
            {
              $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "_id",
                as: "roleDetails",
              },
            },
            {
              $unwind: "$roleDetails",
            },
            {
              $lookup: {
                from: "rolepermissions",
                localField: "roleId",
                foreignField: "roleId",
                as: "userPermissions",
                pipeline: [
                  {
                    $lookup: {
                      from: "permissions",
                      localField: "permissionId",
                      foreignField: "_id",
                      as: "permissions",
                      pipeline: [
                        {
                          $project: {
                            name: 1,
                            description: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind: "$permissions",
                  },
                  {
                    $replaceRoot: {
                      newRoot: "$permissions",
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 0,
                roleId: 1,
                roleName: "$roleDetails.name",
                roleDescription: "$roleDetails.description",
                permissions: "$userPermissions",
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          roles: "$userRoles",
          allPermissions: {
            $reduce: {
              input: "$userRoles",
              initialValue: [],
              in: {
                $setUnion: ["$$value", "$$this.permissions"],
              },
            },
          },
        },
      },
    ]);

    return userRolePermissions[0];
  }
}
