import { objectId } from "@ansospace/types";
import z from "zod";

// Base Schema
export const PlatformSchema = z.object({
  id: objectId,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  createdBy: objectId,
  updatedBy: objectId.optional(),
  isDeleted: z.boolean().default(false),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Platform = z.infer<typeof PlatformSchema>;

// Client-facing Create Input
export const CreatePlatformInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type CreatePlatformInput = z.infer<typeof CreatePlatformInputSchema>;

// Internal Full Create Schema (used by service)
export const CreatePlatformSchema = CreatePlatformInputSchema.extend({
  createdBy: objectId,
});

export type CreatePlatform = z.infer<typeof CreatePlatformSchema>;

// GetPlatform Schema
export const GetPlatformSchema = z.object({
  id: objectId,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GetPlatform = z.infer<typeof GetPlatformSchema>;

// UpdatePlatform Schema
export const UpdatePlatformInputSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdatePlatformInput = z.infer<typeof UpdatePlatformInputSchema>;

export const UpdatePlatformSchema = UpdatePlatformInputSchema.extend({
  updatedBy: objectId,
});

export type UpdatePlatform = z.infer<typeof UpdatePlatformSchema>;
