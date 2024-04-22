import { ZodError } from 'zod';
import { UserDAL } from './user.dal';
import { UserDto } from './user.dto';
import { CreateUser, createUserSchema, GetUser, validateUsername } from './user.validation';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { validateMongoId } from '../../../utils/validation.util';

export class UserService {
  static async createUser(userData: CreateUser): Promise<GetUser | ZodError> {
    const validUserData = createUserSchema.parse(userData);

    const isUserExist = await UserDAL.getUserByEmail(validUserData.email);

    if (isUserExist) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS);

    const isUserNameExist = await UserDAL.getUserByUsername(validUserData.username);

    if (isUserNameExist) throw new Error(ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS);

    const createdUser = await UserDAL.createUser(validUserData);
    return UserDto(createdUser).getUser();
  }

  static async getAllUsers(): Promise<GetUser[]> {
    const users = await UserDAL.getAllUsers();
    return users.map((user) => UserDto(user).getUser());
  }

  static async getUserByUsername(username: string): Promise<GetUser | null> {
    const validateData = validateUsername.parse({ username });

    const user = await UserDAL.getUserByUsername(validateData.username);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async getUserById(userId: string): Promise<GetUser | null> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.getUserById(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async softDeleteUser(userId: string): Promise<GetUser | null> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.softDeleteUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async restoreUser(userId: string): Promise<GetUser | null> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.restoreUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }
}
