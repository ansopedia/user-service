import type { GetPlatform, Platform } from "@/types";

export const PlatformDto = (platform: Platform) => ({
  getPlatform: (): GetPlatform => ({
    id: platform.id,
    name: platform.name,
    slug: platform.slug,
    description: platform.description,
    logoUrl: platform.logoUrl,
    status: platform.status,
    createdAt: platform.createdAt,
    updatedAt: platform.updatedAt,
  }),
});
