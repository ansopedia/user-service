import { AuthModel } from "./auth.model";
import { Auth } from "./auth.validation";

export class AuthDAL {
  static async getAuthsByUserId(userId: string): Promise<Auth[]> {
    return await AuthModel.find({ userId });
  }

  static async getAuthByRefreshToken(refreshToken: string): Promise<Auth | null> {
    return await AuthModel.findOne({ refreshToken });
  }

  static async insertAuthToken(auth: Auth) {
    const newAuth = new AuthModel(auth);
    return await newAuth.save();
  }

  static async deleteAuthBySessionIdAndUserId(sessionId: string, userId: string): Promise<Auth | null> {
    return await AuthModel.findOneAndDelete({ _id: sessionId, userId });
  }

  static async deleteAllAuthsByUserId(userId: string): Promise<{ deletedCount?: number }> {
    return await AuthModel.deleteMany({ userId });
  }

  static async deleteAllExceptSessionId(userId: string, sessionId: string): Promise<{ deletedCount?: number }> {
    return await AuthModel.deleteMany({ userId, _id: { $ne: sessionId } });
  }
}
