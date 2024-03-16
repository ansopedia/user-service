import { ZodError } from 'zod';
import { UserDAL } from './user.dal';
import { UserDto } from './user.dto';
import { createUser, createUserSchema, getUser, validateUsername } from './user.validation';
import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';

export class UserService {
  static async createUser(userData: createUser): Promise<getUser | ZodError> {
    const validUserData = createUserSchema.parse(userData);

    const isUserExist = await UserDAL.getUserByEmail(validUserData.email);

    if (isUserExist) {
      throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS);
    }

    const createdUser = await UserDAL.createUser(validUserData);
    return UserDto(createdUser).getUser();
  }

  static async getUserByUsername(username: string): Promise<getUser | null> {
    const validateData = validateUsername.parse({ username });

    const user = await UserDAL.getUserByUsername(validateData.username);

    if (!user) {
      throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);
    }

    return UserDto(user).getUser();
  }
}
