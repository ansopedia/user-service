import { ZodError } from 'zod';
import { UserDAL } from './user.dal';
import { UserDto } from './user.dto';
import { createUser, createUserSchema, getUser } from './user.validation';
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
}
