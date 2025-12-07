import { type GetPlatform, type UpdatePlatformInput } from "@ansospace/types";
import { describe, expect, it } from "vitest";

import { ROUTES, defaultPlatformData, defaultUsers, mockUser } from "@/constants";
import {
  createPlatformRequest,
  deletePlatformRequest,
  expectCreatePlatformSuccess,
  expectDeletePlatformSuccess,
  expectGetPlatformBySlugSuccess,
  expectGetPlatformsSuccess,
  expectLoginSuccess,
  expectPlatformNotFoundError,
  expectSignUpSuccess,
  expectUnauthorizedResponseWhenUserHasInsufficientPermission,
  expectUpdatePlatformSuccess,
  getPlatformBySlugRequest,
  getPlatformsRequest,
  login,
  signUp,
  updatePlatformRequest,
  verifyAccount,
} from "@/utils/test";

describe("Platform API", () => {
  let adminAuthToken: string;
  let userAuthToken: string;
  let platformData: GetPlatform;

  beforeAll(async () => {
    const adminLoginResponse = await login(defaultUsers);
    expectLoginSuccess(adminLoginResponse);

    adminAuthToken = `Bearer ${adminLoginResponse.header["authorization"]}`;

    // Sign up a regular user (without admin permissions)
    const signUpResponse = await signUp(mockUser);
    expectSignUpSuccess(signUpResponse);

    await verifyAccount(signUpResponse.body.data);

    const loginResponse = await login(mockUser);
    expectLoginSuccess(loginResponse);

    userAuthToken = `Bearer ${loginResponse.header["authorization"]}`;
  });

  describe(`POST /api/v1${ROUTES.PLATFORMS}`, () => {
    it("should create a platform successfully", async () => {
      const response = await createPlatformRequest(defaultPlatformData, adminAuthToken);

      expectCreatePlatformSuccess(response, defaultPlatformData);

      platformData = response.body.data.platform;
    });

    it("should not create a platform without create-platform permission", async () => {
      const response = await createPlatformRequest(defaultPlatformData, userAuthToken);

      expectUnauthorizedResponseWhenUserHasInsufficientPermission(response);
    });

    it("should return error for duplicate slug", async () => {
      // Create first platform
      await createPlatformRequest(defaultPlatformData, adminAuthToken);

      // Try to create duplicate
      const response = await createPlatformRequest(defaultPlatformData, adminAuthToken);

      expect(response.status).toBe(409);
      expect(response.body.code).toBe("platform_already_exists");
    });
  });

  describe(`GET /api/v1${ROUTES.PLATFORMS}`, () => {
    it("should get all platforms", async () => {
      await createPlatformRequest(defaultPlatformData, adminAuthToken);

      const response = await getPlatformsRequest(adminAuthToken);

      expectGetPlatformsSuccess(response);
    });

    it("should not get platforms without view-platform permission", async () => {
      const response = await getPlatformsRequest(userAuthToken);

      expectUnauthorizedResponseWhenUserHasInsufficientPermission(response);
    });
  });

  describe(`GET /api/v1${ROUTES.PLATFORMS.BY_SLUG}`, () => {
    it("should get platform by slug", async () => {
      const { slug } = platformData;

      const response = await getPlatformBySlugRequest(slug);

      expectGetPlatformBySlugSuccess(response, defaultPlatformData);
    });

    it("should return 404 for non-existent platform", async () => {
      const response = await getPlatformBySlugRequest("non-existent-slug");

      expectPlatformNotFoundError(response);
    });
  });

  describe(`PUT /api/v1${ROUTES.PLATFORMS.BY_SLUG}`, () => {
    it("should update platform successfully", async () => {
      const { slug } = platformData;

      const updateData: UpdatePlatformInput = {
        name: "Updated Service Marketplace",
        description: "Updated description",
      };

      const response = await updatePlatformRequest(slug, updateData, adminAuthToken);

      expectUpdatePlatformSuccess(response, updateData);
    });

    it("should not update platform without edit-platform permission", async () => {
      const { slug } = platformData;

      const updateData: UpdatePlatformInput = {
        name: "Updated Service Marketplace",
        description: "Updated description",
      };

      const response = await updatePlatformRequest(slug, updateData, userAuthToken);

      expectUnauthorizedResponseWhenUserHasInsufficientPermission(response);
    });
  });

  describe(`DELETE /api/v1${ROUTES.PLATFORMS.BY_SLUG}`, () => {
    it("should soft delete platform successfully", async () => {
      const { slug } = platformData;

      const response = await deletePlatformRequest(slug, adminAuthToken);

      expectDeletePlatformSuccess(response);

      // Verify platform is soft deleted
      const getResponse = await getPlatformBySlugRequest(slug);

      expect(getResponse.status).toBe(404);
    });

    it("should not delete platform without delete-platform permission", async () => {
      const { slug } = platformData;
      const response = await deletePlatformRequest(slug, userAuthToken);

      expectUnauthorizedResponseWhenUserHasInsufficientPermission(response);
    });
  });
});
