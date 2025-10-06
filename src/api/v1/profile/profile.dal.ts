import type { ObjectId, ProfileData } from "@ansospace/types";

import { ProfileDataModel } from "./profile.model.js";

interface IProfileDataDal {
  upSertProfileData(data: ProfileData): Promise<ProfileData>;
  getProfileData(userId: ObjectId): Promise<ProfileData | null>;
  toggleProfileVisibility(userId: ObjectId, isPublic: boolean): Promise<ProfileData | null>;
}

export class ProfileDataDAL implements IProfileDataDal {
  async upSertProfileData(data: ProfileData): Promise<ProfileData> {
    return await ProfileDataModel.findOneAndUpdate({ userId: data.userId }, data, {
      upsert: true,
      new: true,
    });
  }

  async getProfileData(userId: ObjectId): Promise<ProfileData | null> {
    return await ProfileDataModel.findOne({ userId });
  }

  async toggleProfileVisibility(userId: ObjectId, isPublic: boolean): Promise<ProfileData | null> {
    return await ProfileDataModel.findOneAndUpdate({ userId }, { isPublic }, { new: true });
  }
}
