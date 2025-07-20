import { ErrorTypeEnum } from "@/constants";

import { ProfileDataDAL } from "./profile.dal";
import { ProfileData, validateProfileSchema } from "./profile.validation";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData): Promise<ProfileData> => {
    const profileData = validateProfileSchema(data);
    return await this.profileDataDal.upSertProfileData(profileData);
  };

  getProfileData = async (userId: string): Promise<ProfileData | null> => {
    return await this.profileDataDal.getProfileData(userId);
  };

  toggleProfileVisibility = async (userId: string, isPublic: boolean): Promise<ProfileData> => {
    const profile = await this.profileDataDal.toggleProfileVisibility(userId, isPublic);

    if (!profile) {
      throw new Error(ErrorTypeEnum.enum.PROFILE_REQUIRED_FOR_VISIBILITY_CHANGE);
    }

    return profile;
  };
}
