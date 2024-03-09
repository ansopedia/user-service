import { ZodError } from 'zod';
import { UserDAL } from './user.dal';
import { UserDto } from './user.dto';
import { createUser, createUserSchema, getUser } from './user.validation';

export class UserService {
  static async createUser(userData: createUser): Promise<getUser | ZodError> {
    const validUserData = createUserSchema.safeParse(userData);

    if (!validUserData.success) {
      return validUserData.error;
    }

    const createdUser = await UserDAL.createUser(validUserData.data);
    return UserDto(createdUser).getUser();
  }
}
