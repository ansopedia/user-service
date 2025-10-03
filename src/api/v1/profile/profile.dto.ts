import type { ProfileData } from "@ansospace/types";

export const ProfileDto = (profile: ProfileData) => ({
  getProfile: () => {
    return {
      name: profile.name,
      givenName: profile.givenName,
      familyName: profile.familyName,
      userId: profile.userId,
      avatar: profile.avatar,
      bio: profile.bio,
      address: profile.address,
      phoneNumber: profile.phoneNumber,
      socialLinks: profile.socialLinks,
    };
  },
});
