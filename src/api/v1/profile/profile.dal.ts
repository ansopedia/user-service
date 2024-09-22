import { ProfileDataModel } from "./profile.modal";
import { ProfileData } from "./profile.validation";

interface IProfileDataDal {
  upSertProfileData(payload: ProfileData): Promise<ProfileData>;
}

export class ProfileDataDAL implements IProfileDataDal {
  async upSertProfileData(payload: ProfileData): Promise<ProfileData> {
    return await ProfileDataModel.findOneAndUpdate({ userId: payload.userId }, payload, {
      upsert: true,
      new: true,
    });
  }
}
