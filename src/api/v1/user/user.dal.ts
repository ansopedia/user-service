import { UserModel } from './user.model';
import { createUser, user } from './user.validation';

export class UserDAL {
  static async createUser(userData: createUser): Promise<user> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }
}
