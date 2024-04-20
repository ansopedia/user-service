import mongoose from 'mongoose';
import { z } from 'zod';

export const userNameSchema = z
  .string()
  .min(3, 'username must be at least 3 characters')
  .max(18, 'username must be at most 18 characters')
  .regex(/^[a-z]/i, 'username must start with a letter')
  .regex(/^[a-z0-9]*$/i, 'username can only contain alphanumeric characters')
  .transform((val) => val.toLowerCase().trim());

const ObjectIdSchema = z
  .object({
    type: z.literal('ObjectId'),
  })
  .refine((value) => mongoose.Types.ObjectId.isValid(value.type), {
    message: 'Must be a valid MongoDB ObjectId',
  });

export const publicProfileSchema = z.object({
  userId: ObjectIdSchema,
  avatar: z.string().url(),
  banner: z.string().url(),
  bio: z.string().max(200),
  dob: z.date(),
  fullName: z.string().trim(),
  isVerified: z.boolean(),
  phoneNumber: z.string(),
  portfolioUrl: z.string().url(),
  pronouns: z.enum(['he/him', 'she/her', 'they/them', 'other']),
});

export type UserName = z.infer<typeof userNameSchema>;
export type ObjectId = z.infer<typeof ObjectIdSchema>;
export type PublicProfileSchema = z.infer<typeof publicProfileSchema>;
