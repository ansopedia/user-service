import { MongooseObjectId } from "../../../types";
import { generateRefreshToken } from "../../../utils";
import { Session } from "../auth/auth.validation";
import sessionModel from "./session.model";

interface ISessionDal {
  getSessionById(sessionId: MongooseObjectId): Promise<Session | null>;
}

export class SessionDAL implements ISessionDal {
  async getSessionById(sessionId: MongooseObjectId): Promise<Session | null> {
    return await sessionModel.findOne({ sessionId });
  }

  async insertSession(session: Omit<Session, "refreshToken" | "createdAt" | "updatedAt">): Promise<Session> {
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
    await sessionModel.deleteOne({ sessionId });
  }
}
