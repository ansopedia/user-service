import { AuthModel } from "./auth.modal";
import { Auth } from "./auth.validation";

export class AuthDAL {
  static async getAuthByUserId(userId: string): Promise<Auth | null> {
    return await AuthModel.findOne({ userId });
  }

  static async getAuthByRefreshToken(refreshToken: string): Promise<Auth | null> {
    return await AuthModel.findOne({ refreshToken });
  }

  static async upsertAuthTokens({ userId, refreshToken }: Auth): Promise<Auth | null> {
    return await AuthModel.findOneAndUpdate({ userId }, { refreshToken }, { upsert: true, new: true });
  }

  static async deleteAuth(userId: string): Promise<Auth | null> {
    return await AuthModel.findOneAndDelete({ userId });
  }
}
