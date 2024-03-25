import { z } from 'zod';

export const validateMongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
