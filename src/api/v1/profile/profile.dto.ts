import { ProfileData } from './profile.validation';

export const ProfileDto = (profile: ProfileData) => ({
  getProfile: () => {
    return {
      userId: profile.userId,
      avatar: profile.avatar,
      bio: profile.bio,
      address: profile.address,
      phoneNumber: profile.phoneNumber,
      socialLinks: profile.socialLinks,
    };
  },
});
