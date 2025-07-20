import { ProfileDataModel } from "./profile.model";
import { ProfileData } from "./profile.validation";

interface IProfileDataDal {
  upSertProfileData(data: ProfileData): Promise<ProfileData>;
  getProfileData(userId: string): Promise<ProfileData | null>;
  toggleProfileVisibility(userId: string, isPublic: boolean): Promise<ProfileData | null>;
}

export class ProfileDataDAL implements IProfileDataDal {
  async upSertProfileData(data: ProfileData): Promise<ProfileData> {
    return await ProfileDataModel.findOneAndUpdate({ userId: data.userId }, data, {
      upsert: true,
      new: true,
    });
  }

  async getProfileData(userId: string): Promise<ProfileData | null> {
    return await ProfileDataModel.findOne({ userId });
  }

  async toggleProfileVisibility(userId: string, isPublic: boolean): Promise<ProfileData | null> {
    return await ProfileDataModel.findOneAndUpdate({ userId }, { isPublic }, { new: true });
  }
}
