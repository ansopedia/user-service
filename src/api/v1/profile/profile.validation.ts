import { z } from 'zod';
import { objectIdSchema } from '@/utils';

export const profileSchema = z.object({
  userId: objectIdSchema,
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  phoneNumber: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
});

export const validateProfileSchema = (data: ProfileData) => {
  // Check if at least one key from profileSchema is present in the data, excluding userId
  const hasAnyKey = Object.keys(profileSchema.shape)
    .filter((key) => key !== 'userId')
    .some((key) => key in data && data[key as keyof ProfileData] !== undefined);

  if (!hasAnyKey) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: Object.keys(profileSchema.shape).filter((key) => key !== 'userId'),
        message: 'At least one field from the profile schema must be provided',
      },
    ]);
  }

  return profileSchema.parse(data);
};

export type ProfileData = z.infer<typeof profileSchema>;
export type CreateProfileData = Omit<ProfileData, 'userId'>;
