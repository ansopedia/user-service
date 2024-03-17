import { UserModel } from './user.model';
import { createUser, User } from './user.validation';

export class UserDAL {
  static async createUser(userData: createUser): Promise<User> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }

  static async getAllUsers(): Promise<User[]> {
    return await UserModel.find();
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username });
  }
}
