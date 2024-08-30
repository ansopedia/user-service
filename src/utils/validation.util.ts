import { Types } from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid ObjectId',
});

export const validateObjectId = (objectId: string) => {
  return objectIdSchema.parse(objectId);
};
