import { z } from "zod";

import { userActionTypeSchema } from "@/constants/events.constant";
import { mongooseObjectId } from "@/types";

export const tokenSchema = z.object({
  id: mongooseObjectId,
  userId: mongooseObjectId,
  action: userActionTypeSchema,
  token: z.string(),
  isUsed: z.boolean(),
  expiryTime: z.date(),
  requestAttempts: z.number(),
  metadata: z.any().optional(),
});

export const createTokenSchema = tokenSchema.pick({
  userId: true,
  action: true,
  token: true,
  expiryTime: true,
  isUsed: true,
});

export const updateTokenSchema = tokenSchema
  .pick({ isUsed: true, requestAttempts: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for token update",
  });

export type Token = z.infer<typeof tokenSchema>;
export type CreateToken = z.infer<typeof createTokenSchema>;
export type GetToken = z.infer<typeof tokenSchema>;
export type UpdateToken = z.infer<typeof updateTokenSchema>;
export type DeleteToken = z.infer<typeof tokenSchema>;
export type GetTokens = z.infer<typeof tokenSchema>;
