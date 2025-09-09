import { type MongooseObjectId } from "@/types";
import { generateRefreshToken } from "@/utils";

import { type Session } from "../auth/auth.validation.js";
import sessionModel from "./session.model.js";

// Type for safe session data (without sensitive fields)
export type SessionSafe = Omit<Session, "refreshToken">;

interface ISessionDal {
  getSessionById(sessionId: MongooseObjectId): Promise<Session | null>;
  getSessionsByUserId(userId: MongooseObjectId): Promise<Session[]>;
  getActiveSessionsByUserId(userId: MongooseObjectId): Promise<Session[]>;
  getActiveSessionsSafe(userId: MongooseObjectId): Promise<SessionSafe[]>; // Safe version without sensitive data
  insertSession(session: Omit<Session, "refreshToken" | "createdAt" | "updatedAt" | "isActive">): Promise<Session>;
  updateSession(sessionId: MongooseObjectId): Promise<Session | null>;
  updateSessionByUserAndDevice(
    userId: MongooseObjectId,
    deviceId: string,
    update: Partial<Session>
  ): Promise<Session | null>;
  deleteSession(sessionId: MongooseObjectId): Promise<void>;
  deleteSessionByUserAndDevice(userId: MongooseObjectId, deviceId: string): Promise<void>;
  deleteAllExceptSessionId(userId: MongooseObjectId, sessionId: MongooseObjectId): Promise<{ deletedCount?: number }>;
  deleteAllSession(userId: MongooseObjectId): Promise<{ deletedCount?: number }>;
  deactivateAllExceptSessionId(
    userId: MongooseObjectId,
    sessionId: MongooseObjectId
  ): Promise<{ modifiedCount?: number }>;
  deactivateAllSession(userId: MongooseObjectId): Promise<{ modifiedCount?: number }>;
}

export class SessionDAL implements ISessionDal {
  async getActiveSessionsByUserId(userId: MongooseObjectId): Promise<Session[]> {
    // Select only safe fields, exclude sensitive data like refreshToken
    return await sessionModel.find({ userId, isActive: true }).select("-refreshToken"); // Exclude refreshToken using select notation
  }

  async getActiveSessionsSafe(userId: MongooseObjectId): Promise<SessionSafe[]> {
    return await sessionModel.find({ userId, isActive: true }).select("-refreshToken"); // Exclude refreshToken using select notation
  }

  async updateSessionByUserAndDevice(
    userId: MongooseObjectId,
    deviceId: string,
    update: Partial<Session>
  ): Promise<Session | null> {
    return await sessionModel.findOneAndUpdate({ userId, deviceId }, update, { new: true });
  }

  async deactivateAllExceptSessionId(
    userId: MongooseObjectId,
    sessionId: MongooseObjectId
  ): Promise<{ modifiedCount?: number }> {
    const result = await sessionModel.updateMany({ userId, _id: { $ne: sessionId } }, { isActive: false });
    return { modifiedCount: result.modifiedCount };
  }

  async deactivateAllSession(userId: MongooseObjectId): Promise<{ modifiedCount?: number }> {
    const result = await sessionModel.updateMany({ userId }, { isActive: false });
    return { modifiedCount: result.modifiedCount };
  }
  async getSessionById(sessionId: MongooseObjectId): Promise<Session | null> {
    return await sessionModel.findById(sessionId);
  }

  async getSessionsByUserId(userId: MongooseObjectId): Promise<Session[]> {
    return await sessionModel.find({ userId });
  }

  async insertSession(
    session: Omit<Session, "refreshToken" | "createdAt" | "updatedAt" | "isActive" | "id">
  ): Promise<Session> {
    const newSession = new sessionModel(session);
    const refreshToken = generateRefreshToken({ sessionId: newSession.id });
    newSession.refreshToken = refreshToken;
    return await newSession.save();
  }

  async updateSession(sessionId: MongooseObjectId): Promise<Session | null> {
    const refreshToken = generateRefreshToken({ sessionId });

    return await sessionModel.findByIdAndUpdate(
      sessionId,
      {
        refreshToken,
        lastActive: new Date(),
        $inc: { tokenVersion: 1 },
      },
      { new: true }
    );
  }

  async deleteSession(sessionId: MongooseObjectId): Promise<void> {
    await sessionModel.findByIdAndDelete(sessionId);
  }

  async deleteSessionByUserAndDevice(userId: MongooseObjectId, deviceId: string): Promise<void> {
    await sessionModel.deleteOne({ userId, deviceId });
  }

  async deleteAllExceptSessionId(
    userId: MongooseObjectId,
    sessionId: MongooseObjectId
  ): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId, _id: { $ne: sessionId } });
  }

  async deleteAllSession(userId: MongooseObjectId): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId });
  }
}
