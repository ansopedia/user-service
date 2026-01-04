import type { DeviceId, DeviceInfo, ObjectId, Session, SessionQueryOptions } from "@ansospace/types";
import type { SortOrder, UpdateQuery } from "mongoose";

import { generateRefreshToken } from "@/utils";

import { toSessionDTO } from "./session.dto.js";
import sessionModel from "./session.model.js";

// Type for safe session data (without sensitive fields)
export type SessionSafe = Omit<Session, "refreshToken">;

interface ISessionDal {
  getSessionById(sessionId: ObjectId): Promise<Session | null>;
  getSessionByUserAndDevice(userId: ObjectId, deviceId: DeviceId): Promise<Session | null>;
  getSessionsByUserId(userId: ObjectId): Promise<Session[]>;
  getActiveSessionsByUserId(userId: ObjectId, options: SessionQueryOptions): Promise<Session[]>;
  getActiveSessionsSafe(userId: ObjectId): Promise<SessionSafe[]>; // Safe version without sensitive data
  insertSession(
    session: Omit<Session, "refreshToken" | "createdAt" | "updatedAt" | "isActive" | "id">
  ): Promise<Session>;
  upsertSession(userId: ObjectId, deviceId: DeviceId, deviceInfo: DeviceInfo, tokenVersion: number): Promise<Session>;
  updateSession(sessionId: ObjectId, updates: UpdateQuery<Session>): Promise<Session | null>;
  updateSessionByUserAndDevice(userId: ObjectId, deviceId: DeviceId, update: Partial<Session>): Promise<Session | null>;
  deleteSession(sessionId: ObjectId): Promise<void>;
  deleteSessionByUserAndDevice(userId: ObjectId, deviceId: DeviceId): Promise<void>;
  deleteAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ deletedCount?: number }>;
  deleteAllSession(userId: ObjectId): Promise<{ deletedCount?: number }>;
  deactivateAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ modifiedCount?: number }>;
  deactivateAllSession(userId: ObjectId): Promise<{ modifiedCount?: number }>;
}

export class SessionDAL implements ISessionDal {
  async getActiveSessionsByUserId(userId: ObjectId, options: SessionQueryOptions): Promise<Session[]> {
    // 1. Set Defaults
    const { limit, skip, sortBy } = options; // Default to 20 sessions
    const order = options.order === "asc" ? 1 : -1; // -1 is Descending (Newest first)

    // 2. Build the Sort Object dynamically
    const sortCriteria: { [key: string]: SortOrder } = { [sortBy]: order };

    // 3. Execute Query with filters
    const docs = await sessionModel
      .find({ userId, isActive: true })
      .select("-refreshToken") // Security
      .sort(sortCriteria) // Sorting (e.g., Newest Active first)
      .skip(skip) // Pagination
      .limit(limit); // Limiting

    // 4. Transform to DTO
    return docs.map(toSessionDTO);
  }

  async getActiveSessionsSafe(userId: ObjectId): Promise<SessionSafe[]> {
    return await sessionModel.find({ userId, isActive: true }).select("-refreshToken"); // Exclude refreshToken using select notation
  }

  async updateSessionByUserAndDevice(
    userId: ObjectId,
    deviceId: DeviceId,
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

  async getSessionByUserAndDevice(userId: ObjectId, deviceId: DeviceId): Promise<Session | null> {
    return await sessionModel.findOne({ userId, deviceId });
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

  async upsertSession(
    userId: ObjectId,
    deviceId: DeviceId,
    deviceInfo: DeviceInfo,
    tokenVersion: number
  ): Promise<Session> {
    const existingSession = await sessionModel.findOne({ userId, deviceId });

    if (existingSession) {
      // ✅ RE-LOGIN: Increment Version (Never Reset!)
      const nextVersion = (existingSession.tokenVersion ?? 0) + 1;

      existingSession.deviceInfo = deviceInfo;
      existingSession.lastActive = new Date();
      existingSession.lastLoginAt = new Date(); // Start of NEW session
      existingSession.tokenVersion = nextVersion;
      existingSession.isActive = true;
      existingSession.refreshToken = generateRefreshToken({ sessionId: existingSession.id });
      return await existingSession.save();
    }

    return await this.insertSession({
      userId,
      deviceId,
      deviceInfo,
      tokenVersion,
      lastActive: new Date(),
      lastLoginAt: new Date(),
    } as any); // Cast to any to bypass strict type check if lastLoginAt is missing in base type
  }

  async updateSession(
    sessionId: ObjectId,
    updates: UpdateQuery<Session> // Use Mongoose's UpdateQuery type
  ): Promise<Session | null> {
    return await sessionModel.findByIdAndUpdate(
      sessionId,
      updates,
      { new: true } // Return the updated document
    );
  }

  async deleteSession(sessionId: ObjectId): Promise<void> {
    await sessionModel.findByIdAndDelete(sessionId);
  }

  async deleteSessionByUserAndDevice(userId: ObjectId, deviceId: DeviceId): Promise<void> {
    await sessionModel.deleteOne({ userId, deviceId });
  }

  async deleteAllExceptSessionId(userId: ObjectId, sessionId: ObjectId): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId, _id: { $ne: sessionId } });
  }

  async deleteAllSession(userId: ObjectId): Promise<{ deletedCount?: number }> {
    return await sessionModel.deleteMany({ userId });
  }
}
