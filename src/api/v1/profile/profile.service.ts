import { ProfileDataDAL } from "./profile.dal";
import { ProfileDto } from "./profile.dto";
import { ProfileData, validateProfileSchema } from "./profile.validation";

export class ProfileService {
  private profileDataDal: ProfileDataDAL;

  constructor() {
    this.profileDataDal = new ProfileDataDAL();
  }

  upSertProfileData = async (payload: ProfileData) => {
    const profileData = validateProfileSchema(payload);

    const updateProfileData = await this.profileDataDal.upSertProfileData(profileData);
    return ProfileDto(updateProfileData).getProfile();
  };
}
