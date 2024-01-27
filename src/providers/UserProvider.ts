import { IUser, UserModel } from '../models/User';

interface ICreateUserProps {
  name: string;
  email: string;
  password: string;
}

interface IUserUpdateUserStatus {
  isAccountVerified?: boolean;
  isAccountDisabled?: boolean;
  isProfileComplete?: boolean;
}

export class UserProvider {
  static async createUser({
    name,
    email,
    password,
  }: ICreateUserProps): Promise<IUser> {
    const user = new UserModel({ name, email, password });
    await user.save();
    return user;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async getUserByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username });
    return user;
  }

  static async getAllUsers(): Promise<IUser[]> {
    const users = await UserModel.find();
    return users;
  }

  static async updateUserStatusById(
    userId: string,
    {
      isAccountVerified,
      isAccountDisabled,
      isProfileComplete,
    }: IUserUpdateUserStatus,
  ): Promise<IUser | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAccountVerified, isAccountDisabled, isProfileComplete },
        {
          new: true, // Return the updated document
          runValidators: true, // Run validators on update
        },
      );

      return updatedUser;
    } catch (error) {
      return null;
    }
  }
}
