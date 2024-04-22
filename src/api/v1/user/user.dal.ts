import { UserModel } from './user.model';
import { CreateUser, User } from './user.validation';

export class UserDAL {
  static async createUser(userData: CreateUser): Promise<User> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }

  static async getAllUsers(): Promise<User[]> {
    return await UserModel.find({ isDeleted: false });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username, isDeleted: false });
  }

  static async getUserById(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  static async softDeleteUser(userId: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  }

  static async restoreUser(userId: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { isDeleted: false }, { new: true });
  }
}
