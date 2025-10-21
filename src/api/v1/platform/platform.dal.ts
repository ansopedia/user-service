import type { ObjectId } from "@ansospace/types";

import type { CreatePlatform, Platform, UpdatePlatform } from "@/types";

import { PlatformModel } from "./platform.model.js";

export class PlatformDAL {
  static async createPlatform(platform: CreatePlatform): Promise<Platform> {
    return await PlatformModel.create({
      ...platform,
    });
  }

  static async getPlatformById(id: ObjectId): Promise<Platform | null> {
    return await PlatformModel.findById(id);
  }

  static async getPlatformBySlug(slug: string): Promise<Platform | null> {
    return await PlatformModel.findOne({ slug });
  }

  static async getPlatforms(): Promise<Platform[]> {
    return await PlatformModel.find({ isDeleted: false });
  }

  static async updatePlatform(id: ObjectId, updateData: UpdatePlatform): Promise<Platform | null> {
    return await PlatformModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async softDeletePlatform(id: ObjectId, updatedBy: ObjectId): Promise<Platform | null> {
    return await PlatformModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), updatedBy },
      { new: true }
    );
  }
}
