import { AuthModel } from './auth.modal';
import { Auth } from './auth.validation';

export class AuthDAL {
  static async createAuth(authData: Auth): Promise<Auth> {
    const newAuth = new AuthModel(authData);
    return await newAuth.save();
  }

  static async updateAuthTokens({ userId, refreshToken }: Auth): Promise<Auth | null> {
    return await AuthModel.findOneAndUpdate(
      { userId },
      { $set: { refreshToken } },
      { new: true }, // Return the updated document
    );
  }

  static async deleteAuth(userId: string): Promise<Auth | null> {
    return await AuthModel.findOneAndDelete({ userId });
  }
}
