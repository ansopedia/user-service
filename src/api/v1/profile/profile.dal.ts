import type { MongooseObjectId, ProfileData } from "@ansospace/types";

import { ProfileDataModel } from "./profile.model.js";

interface IProfileDataDal {
  upSertProfileData(data: ProfileData): Promise<ProfileData>;
  getProfileData(userId: MongooseObjectId): Promise<ProfileData | null>;
  toggleProfileVisibility(userId: MongooseObjectId, isPublic: boolean): Promise<ProfileData | null>;
}

export class ProfileDataDAL implements IProfileDataDal {
  async upSertProfileData(data: ProfileData): Promise<ProfileData> {
    return await ProfileDataModel.findOneAndUpdate({ userId: data.userId }, data, {
      upsert: true,
      new: true,
    });
  }

  async getProfileData(userId: MongooseObjectId): Promise<ProfileData | null> {
    return await ProfileDataModel.findOne({ userId });
  }

  async toggleProfileVisibility(userId: MongooseObjectId, isPublic: boolean): Promise<ProfileData | null> {
    return await ProfileDataModel.findOneAndUpdate({ userId }, { isPublic }, { new: true });
  }
}
