import { beforeEach, describe, expect, it } from "vitest";

import { defaultPlatformData, defaultUsers } from "@/constants";
import {
  createPlatformRequest,
  deletePlatformRequest,
  expectCreatePlatformSuccess,
  expectDeletePlatformSuccess,
  expectGetPlatformBySlugSuccess,
  expectGetPlatformsSuccess,
  expectUpdatePlatformSuccess,
  getPlatformBySlugRequest,
  getPlatformsRequest,
  login,
  updatePlatformRequest,
} from "@/utils/test";

import type { UpdatePlatformInput } from "../../../../types/platform.types.js";
import { PlatformModel } from "../platform.model.js";

describe("Platform API", () => {
  let authToken: string;

  beforeEach(async () => {
    const loginResponse = await login(defaultUsers);

    authToken = `Bearer ${loginResponse.header["authorization"]}`;

    // Clear platforms
    await PlatformModel.deleteMany({});
  });

  describe("POST /api/v1/platforms", () => {
    it("should create a platform successfully", async () => {
      const response = await createPlatformRequest(defaultPlatformData, authToken);

      expectCreatePlatformSuccess(response, defaultPlatformData);
    });

    it("should return error for duplicate slug", async () => {
      // Create first platform
      await createPlatformRequest(defaultPlatformData, authToken);

      // Try to create duplicate
      const response = await createPlatformRequest(defaultPlatformData, authToken);

      expect(response.status).toBe(409);
      expect(response.body.code).toBe("platform_already_exists");
    });
  });

  describe("GET /api/v1/platforms", () => {
    it("should get all platforms", async () => {
      await createPlatformRequest(defaultPlatformData, authToken);

      const response = await getPlatformsRequest(authToken);

      expectGetPlatformsSuccess(response);
    });
  });

  describe("GET /api/v1/platforms/:slug", () => {
    it("should get platform by slug", async () => {
      const createResponse = await createPlatformRequest(defaultPlatformData, authToken);

      const { slug } = createResponse.body.data.platform;

      const response = await getPlatformBySlugRequest(slug, authToken);

      expectGetPlatformBySlugSuccess(response, defaultPlatformData);
    });

    it("should return 404 for non-existent platform", async () => {
      const response = await getPlatformBySlugRequest("non-existent-slug", authToken);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/v1/platforms/:slug", () => {
    it("should update platform successfully", async () => {
      const createResponse = await createPlatformRequest(defaultPlatformData, authToken);

      const { slug } = createResponse.body.data.platform;

      const updateData: UpdatePlatformInput = {
        name: "Updated Service Marketplace",
        description: "Updated description",
      };

      const response = await updatePlatformRequest(slug, updateData, authToken);

      expectUpdatePlatformSuccess(response, updateData);
    });
  });

  describe("DELETE /api/v1/platforms/:slug", () => {
    it("should soft delete platform successfully", async () => {
      const createResponse = await createPlatformRequest(defaultPlatformData, authToken);

      const { slug } = createResponse.body.data.platform;

      const response = await deletePlatformRequest(slug, authToken);

      expectDeletePlatformSuccess(response);

      // Verify platform is soft deleted
      const getResponse = await getPlatformBySlugRequest(slug, authToken);

      expect(getResponse.status).toBe(404);
    });
  });
});
