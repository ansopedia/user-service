import { AuthModel } from './auth.modal';
import { Auth } from './auth.validation';

export class AuthDAL {
  static async createAuth(authData: Auth): Promise<Auth> {
    const newAuth = new AuthModel(authData);
    return await newAuth.save();
  }

  static async updateAuthTokens({ userId, accessToken, refreshToken }: Auth): Promise<Auth | null> {
    return await AuthModel.findOneAndUpdate(
      { userId },
      { $set: { accessToken, refreshToken } },
      { new: true }, // Return the updated document
    );
  }
}
