import type { ObjectId, Session } from "@ansospace/types";

export const toSessionDTO = (doc: Omit<Session, "id"> & { _id: ObjectId }): Session => {
  return {
    id: doc._id,
    userId: doc.userId,
    refreshToken: doc.refreshToken,
    tokenVersion: doc.tokenVersion,
    lastActive: doc.lastActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    deviceId: doc.deviceId,
    deviceInfo: doc.deviceInfo,
    isActive: doc.isActive,
    lastLoginAt: doc.lastLoginAt,
  };
};
