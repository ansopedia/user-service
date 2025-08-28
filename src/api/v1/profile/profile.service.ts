import { ErrorTypeEnum } from "@/constants";
import { type MongooseObjectId } from "@/types";

import { ProfileDataDAL } from "./profile.dal.js";
import { type ProfileData, validateProfileSchema } from "./profile.validation.js";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData): Promise<ProfileData> => {
    const profileData = validateProfileSchema(data);
    return await this.profileDataDal.upSertProfileData(profileData);
  };

  getProfileData = async (userId: MongooseObjectId): Promise<ProfileData | null> => {
    return await this.profileDataDal.getProfileData(userId);
  };

  toggleProfileVisibility = async (userId: MongooseObjectId, isPublic: boolean): Promise<ProfileData> => {
    const profile = await this.profileDataDal.toggleProfileVisibility(userId, isPublic);

    if (!profile) {
      throw new Error(ErrorTypeEnum.enum.PROFILE_REQUIRED_FOR_VISIBILITY_CHANGE);
    }

    return profile;
  };
}
