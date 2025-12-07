import { type ObjectId, type ProfileData, validateProfileSchema } from "@ansospace/types";

import { ErrorTypeEnum } from "@/constants";

import { ProfileDataDAL } from "./profile.dal.js";

export interface IProfileService {
  upSertProfileData(data: ProfileData): Promise<ProfileData>;
  getProfileData(userId: ObjectId): Promise<ProfileData | null>;
  toggleProfileVisibility(userId: ObjectId, isPublic: boolean): Promise<ProfileData>;
}

export class ProfileService implements IProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData): Promise<ProfileData> => {
    const profileData = validateProfileSchema(data);
    return await this.profileDataDal.upSertProfileData(profileData);
  };

  getProfileData = async (userId: ObjectId): Promise<ProfileData | null> => {
    return await this.profileDataDal.getProfileData(userId);
  };

  toggleProfileVisibility = async (userId: ObjectId, isPublic: boolean): Promise<ProfileData> => {
    const profile = await this.profileDataDal.toggleProfileVisibility(userId, isPublic);

    if (!profile) {
      throw new Error(ErrorTypeEnum.enum.PROFILE_REQUIRED_FOR_VISIBILITY_CHANGE);
    }

    return profile;
  };
}
