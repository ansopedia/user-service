import type { CreatePlatform, GetPlatform, ObjectId, UpdatePlatform } from "@ansospace/types";

import { ErrorTypeEnum } from "@/constants";

import { PlatformDAL } from "./platform.dal.js";
import { PlatformDto } from "./platform.dto.js";

export class PlatformService {
  static async createPlatform(createPlatform: CreatePlatform): Promise<GetPlatform> {
    const isPlatformExist = await PlatformDAL.getPlatformBySlug(createPlatform.slug);

    if (isPlatformExist) throw new Error(ErrorTypeEnum.enum.PLATFORM_ALREADY_EXISTS);

    const createdPlatform = await PlatformDAL.createPlatform(createPlatform);

    return PlatformDto(createdPlatform).getPlatform();
  }

  static async getPlatforms(): Promise<GetPlatform[]> {
    const platforms = await PlatformDAL.getPlatforms();
    return platforms.map((platform) => PlatformDto(platform).getPlatform());
  }

  static async getPlatformById(id: ObjectId): Promise<GetPlatform | null> {
    const platform = await PlatformDAL.getPlatformById(id);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);
    return PlatformDto(platform).getPlatform();
  }

  static async getPlatformBySlug(slug: string): Promise<GetPlatform | null> {
    const platform = await PlatformDAL.getPlatformBySlug(slug);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);
    return PlatformDto(platform).getPlatform();
  }

  static async updatePlatform(id: ObjectId, updateData: UpdatePlatform): Promise<GetPlatform | null> {
    const platform = await PlatformDAL.getPlatformById(id);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);

    if (updateData.slug !== undefined) {
      const existingPlatform = await PlatformDAL.getPlatformBySlug(updateData.slug);
      if (existingPlatform && existingPlatform.id !== id) {
        throw new Error(ErrorTypeEnum.enum.PLATFORM_SLUG_ALREADY_EXISTS);
      }
    }

    const updatedPlatform = await PlatformDAL.updatePlatform(id, updateData);
    if (!updatedPlatform) return null;
    return PlatformDto(updatedPlatform).getPlatform();
  }

  static async updatePlatformBySlug(slug: string, updateData: UpdatePlatform): Promise<GetPlatform | null> {
    const platform = await PlatformDAL.getPlatformBySlug(slug);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);

    if (updateData.slug !== undefined) {
      const existingPlatform = await PlatformDAL.getPlatformBySlug(updateData.slug);
      if (existingPlatform && existingPlatform.id !== platform.id) {
        throw new Error(ErrorTypeEnum.enum.PLATFORM_SLUG_ALREADY_EXISTS);
      }
    }

    const updatedPlatform = await PlatformDAL.updatePlatform(platform.id, updateData);
    if (!updatedPlatform) return null;
    return PlatformDto(updatedPlatform).getPlatform();
  }

  static async deletePlatform(id: ObjectId, updatedBy: ObjectId): Promise<boolean> {
    const platform = await PlatformDAL.getPlatformById(id);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);

    const deletedPlatform = await PlatformDAL.softDeletePlatform(id, updatedBy);
    return !!deletedPlatform;
  }

  static async deletePlatformBySlug(slug: string, updatedBy: ObjectId): Promise<boolean> {
    const platform = await PlatformDAL.getPlatformBySlug(slug);
    if (!platform || platform.isDeleted) throw new Error(ErrorTypeEnum.enum.PLATFORM_NOT_FOUND);

    const deletedPlatform = await PlatformDAL.softDeletePlatform(platform.id, updatedBy);
    return !!deletedPlatform;
  }
}
