import { ErrorTypeEnum, ROLES } from "@/constants";
import type { Email, MongooseObjectId, Username } from "@/types";
import { generateRandomUsername } from "@/utils";

import { RoleDAL } from "../role/role.dal.js";
import { UserRoleService } from "../userRole/user-role.service.js";
import { UserDAL } from "./user.dal.js";
import { UserDto } from "./user.dto.js";
import { type GetUser, type RegisterSchema, type UpdateUser, validatePagination } from "./user.validation.js";

export class UserService {
  static async generateUniqueUsername(username: string): Promise<string> {
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
    validatePagination({ limit, offset });
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

  static async getUserById(userId: MongooseObjectId): Promise<GetUser> {
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

  static async softDeleteUser(userId: MongooseObjectId): Promise<GetUser> {
    const user = await UserDAL.softDeleteUser(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async restoreUser(userId: MongooseObjectId): Promise<GetUser> {
    const user = await UserDAL.restoreUser(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async updateUser(userId: MongooseObjectId, userData: UpdateUser): Promise<GetUser> {
    const updatedUser = await UserDAL.updateUser(userId, userData);

    if (!updatedUser) throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);

    return UserDto(updatedUser).getUser();
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await UserDAL.getUserByUsername(username);
    // If user is null/undefined, !user returns true meaning username is available
    // If user exists, !user returns false meaning username is taken
    return !user;
  }
}
