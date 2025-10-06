import type { ObjectId, Session } from "@ansospace/types";

import { generateRefreshToken } from "@/utils";

import sessionModel from "./session.model.js";

// Type for safe session data (without sensitive fields)
export type SessionSafe = Omit<Session, "refreshToken">;

interface ISessionDal {
  getSessionById(sessionId: ObjectId): Promise<Session | null>;
  getSessionsByUserId(userId: ObjectId): Promise<Session[]>;
  getActiveSessionsByUserId(userId: ObjectId): Promise<Session[]>;
  getActiveSessionsSafe(userId: ObjectId): Promise<SessionSafe[]>; // Safe version without sensitive data
  insertSession(session: Omit<Session, "refreshToken" | "createdAt" | "updatedAt" | "isActive">): Promise<Session>;
  updateSession(sessionId: ObjectId): Promise<Session | null>;
  updateSessionByUserAndDevice(userId: ObjectId, deviceId: string, update: Partial<Session>): Promise<Session | null>;
  deleteSession(sessionId: ObjectId): Promise<void>;
  deleteSessionByUserAndDevice(userId: ObjectId, deviceId: string): Promise<void>;
  deleteAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ deletedCount?: number }>;
  deleteAllSession(userId: ObjectId): Promise<{ deletedCount?: number }>;
  deactivateAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ modifiedCount?: number }>;
  deactivateAllSession(userId: ObjectId): Promise<{ modifiedCount?: number }>;
}

export class SessionDAL implements ISessionDal {
  async getActiveSessionsByUserId(userId: ObjectId): Promise<Session[]> {
    // Select only safe fields, exclude sensitive data like refreshToken
    return await sessionModel.find({ userId, isActive: true }).select("-refreshToken"); // Exclude refreshToken using select notation
  }

  async getActiveSessionsSafe(userId: ObjectId): Promise<SessionSafe[]> {
    return await sessionModel.find({ userId, isActive: true }).select("-refreshToken"); // Exclude refreshToken using select notation
  }

  async updateSessionByUserAndDevice(
    userId: ObjectId,
    deviceId: string,
    update: Partial<Session>
  ): Promise<Session | null> {
    return await sessionModel.findOneAndUpdate({ userId, deviceId }, update, { new: true });
  }

  async deactivateAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ modifiedCount?: number }> {
    const result = await sessionModel.updateMany({ userId, _id: { $ne: sessionId } }, { isActive: false });
    return { modifiedCount: result.modifiedCount };
  }

  async deactivateAllSession(userId: ObjectId): Promise<{ modifiedCount?: number }> {
    const result = await sessionModel.updateMany({ userId }, { isActive: false });
    return { modifiedCount: result.modifiedCount };
  }
  async getSessionById(sessionId: ObjectId): Promise<Session | null> {
    return await sessionModel.findById(sessionId);
  }

  async getSessionsByUserId(userId: ObjectId): Promise<Session[]> {
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

  async updateSession(sessionId: ObjectId): Promise<Session | null> {
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

  async deleteSession(sessionId: ObjectId): Promise<void> {
    await sessionModel.findByIdAndDelete(sessionId);
  }

  async deleteSessionByUserAndDevice(userId: ObjectId, deviceId: string): Promise<void> {
    await sessionModel.deleteOne({ userId, deviceId });
  }

  async deleteAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId, _id: { $ne: sessionId } });
  }

  async deleteAllSession(userId: ObjectId): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId });
  }
}
