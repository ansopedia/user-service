import { type MongooseObjectId } from "@/types";

import { AuthModel } from "./auth.model.js";
import { type Auth } from "./auth.validation.js";

export class AuthDAL {
  static async getAuthsByUserId(userId: MongooseObjectId): Promise<Auth[]> {
    return await AuthModel.find({ userId });
  }

  static async getAuthByRefreshToken(refreshToken: string): Promise<Auth | null> {
    return await AuthModel.findOne({ refreshToken });
  }

  static async insertAuthToken(auth: Auth) {
    const newAuth = new AuthModel(auth);
    return await newAuth.save();
  }

  static async deleteAuthBySessionIdAndUserId(
    sessionId: MongooseObjectId,
    userId: MongooseObjectId
  ): Promise<Auth | null> {
    return await AuthModel.findOneAndDelete({ _id: sessionId, userId });
  }

  static async deleteAllAuthsByUserId(userId: MongooseObjectId): Promise<{ deletedCount?: number }> {
    return await AuthModel.deleteMany({ userId });
  }

  static async deleteAllExceptSessionId(
    userId: MongooseObjectId,
    sessionId: MongooseObjectId
  ): Promise<{ deletedCount?: number }> {
    return await AuthModel.deleteMany({ userId, _id: { $ne: sessionId } });
  }

  static async upsertAuthToken(auth: Auth & { sessionId?: MongooseObjectId }) {
    return await AuthModel.findOneAndUpdate({ userId: auth.userId, _id: auth.sessionId }, auth, {
      upsert: true,
      new: true,
    });
  }
}
