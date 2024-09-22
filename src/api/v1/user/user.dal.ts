import mongoose from "mongoose";

import { hashPassword } from "../../../utils";
import { Login } from "../auth/auth.validation";
import { UserModel } from "./user.model";
import { CreateUser, UpdateUser, User, UserRolePermission } from "./user.validation";

export class UserDAL {
  static async createUser(userData: CreateUser): Promise<User> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }

  static async getAllUsers(): Promise<User[]> {
    return await UserModel.find({ isDeleted: false });
  }

  static async getUser(validUserData: Login): Promise<User | null> {
    const identifier = "email" in validUserData ? validUserData.email : validUserData.username;
    return UserDAL.getUserByEmailOrUsername(identifier as string);
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

  static async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username, isDeleted: false });
  }

  static async getUserById(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  static async getUserByGoogleId(googleId: string): Promise<User | null> {
    return await UserModel.findOne({ googleId });
  }

  static async softDeleteUser(userId: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  }

  static async restoreUser(userId: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: false }, { new: true });
  }

  static async updateUser(userId: string, userData: UpdateUser): Promise<User | null> {
    if (userData.password !== null && userData.password !== undefined) {
      userData.password = await hashPassword(userData.password);
    }
    return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
  }

  static async getUserRolesAndPermissionsByUserId(userId: string): Promise<UserRolePermission> {
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
