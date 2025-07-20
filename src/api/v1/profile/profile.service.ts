import { ProfileDataDAL } from "./profile.dal";
import { ProfileData, validateProfileSchema } from "./profile.validation";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (data: ProfileData) => {
    const profileData = validateProfileSchema(data);
    return await this.profileDataDal.upSertProfileData(profileData);
  };

  getProfileData = async (userId: string) => {
    return await this.profileDataDal.getProfileData(userId);
  };

  toggleProfileVisibility = async (userId: string, isPublic: boolean) => {
    return await this.profileDataDal.toggleProfileVisibility(userId, isPublic);
  };
}
