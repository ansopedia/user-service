import { z } from 'zod';
import { objectIdSchema } from '../../../utils';

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

export type Token = z.infer<typeof tokenSchema>;
export type CreateToken = z.infer<typeof createTokenSchema>;
export type getToken = z.infer<typeof tokenSchema>;
export type updateToken = z.infer<typeof tokenSchema>;
export type deleteToken = z.infer<typeof tokenSchema>;
export type getTokens = z.infer<typeof tokenSchema>;
