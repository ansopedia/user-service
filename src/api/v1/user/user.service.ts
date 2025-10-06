import {
  type Email,
  type GetUser,
  type ObjectId,
  type RegisterSchema,
  type UpdateUser,
  type Username,
  paginationSchema,
} from "@ansospace/types";

import { ErrorTypeEnum, ROLES } from "@/constants";
// import type { Email, ObjectId, Username } from "@/types";
import { generateRandomUsername } from "@/utils";

import { RoleDAL } from "../role/role.dal.js";
import { UserRoleService } from "../userRole/user-role.service.js";
import { UserDAL } from "./user.dal.js";
import { UserDto } from "./user.dto.js";

export class UserService {
  static async generateUniqueUsername(username: Username): Promise<Username> {
    const user = await UserDAL.getUserByUsername(username);

    if (!user) return username;

    const newUsername = generateRandomUsername();

    return await this.generateUniqueUsername(newUsername);
  }

  static async registerUser(userData: RegisterSchema): Promise<GetUser> {
    const isUserExist = await UserDAL.getUserByEmail(userData.email);

    if (isUserExist) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS);

    const isUserNameExist = await UserDAL.getUserByUsername(userData.username);

    if (isUserNameExist) throw new Error(ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS);

    const createdUser = await UserDAL.createUser(userData);

    const userRole = await RoleDAL.getRoleByName(ROLES.USER);

    if (!userRole) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

    await UserRoleService.createUserRole({
      userId: createdUser.id,
      roleId: userRole.id,
    });

    return UserDto(createdUser).getUser();
  }

  static async getAllUsers(limit: number, offset: number): Promise<{ users: GetUser[]; totalUsers: number }> {
    paginationSchema.parse({ limit, offset });
    const { users, totalUsers } = await UserDAL.getAllUsers(limit, offset);
    return {
      users: users.map((user) => UserDto(user).getUser()),
      totalUsers,
    };
  }

  static async getUserByUsername(username: Username): Promise<GetUser> {
    const user = await UserDAL.getUserByUsername(username);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async getUserById(userId: ObjectId): Promise<GetUser> {
    const user = await UserDAL.getUserById(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async getUserByGoogleId(googleId: string): Promise<GetUser | null> {
    const user = await UserDAL.getUserByGoogleId(googleId);

    if (user) return UserDto(user).getUser();

    return null;
  }

  static async getUserByEmail(email: Email): Promise<GetUser> {
    const user = await UserDAL.getUserByEmail(email);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async softDeleteUser(userId: ObjectId): Promise<GetUser> {
    const user = await UserDAL.softDeleteUser(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async restoreUser(userId: ObjectId): Promise<GetUser> {
    const user = await UserDAL.restoreUser(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async updateUser(userId: ObjectId, userData: UpdateUser): Promise<GetUser> {
    const updatedUser = await UserDAL.updateUser(userId, userData);

    if (!updatedUser) throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);

    return UserDto(updatedUser).getUser();
  }

  static async checkUsernameAvailability(username: Username): Promise<boolean> {
    const user = await UserDAL.getUserByUsername(username);
    // If user is null/undefined, !user returns true meaning username is available
    // If user exists, !user returns false meaning username is taken
    return !user;
  }
}
