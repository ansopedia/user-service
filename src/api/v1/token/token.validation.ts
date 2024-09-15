import { z } from 'zod';
import { objectIdSchema } from '@/utils';

export enum TokenAction {
  'resetPassword' = 'resetPassword',
  'deleteAccount' = 'deleteAccount',
  'changeSubscription' = 'changeSubscription',
}

export const tokenSchema = z.object({
  id: objectIdSchema,
  userId: objectIdSchema,
  action: z.nativeEnum(TokenAction),
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
});

export const updateTokenSchema = tokenSchema
  .pick({ isUsed: true, requestAttempts: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for token update',
  });

export type Token = z.infer<typeof tokenSchema>;
export type CreateToken = z.infer<typeof createTokenSchema>;
export type GetToken = z.infer<typeof tokenSchema>;
export type UpdateToken = z.infer<typeof updateTokenSchema>;
export type DeleteToken = z.infer<typeof tokenSchema>;
export type GetTokens = z.infer<typeof tokenSchema>;
