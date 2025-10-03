import type { CreateProfileData, MongooseObjectId } from "@ansospace/types";

import { defaultUsers } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectLoginSuccess,
  expectProfileData,
  expectProfileVisibility,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForInvalidToken,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  login,
  toggleProfileVisibility,
  upSertProfileData,
} from "@/utils/test";

const profileData: CreateProfileData = {
  avatar: "http://avatar.com",
  bio: "bio",
  name: "name",
  givenName: "givenName",
  familyName: "familyName",
  phoneNumber: "phoneNumber",
};

describe("Profile Service", () => {
  let authorizationHeader: string;
  let loggedInUserId: MongooseObjectId;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    loggedInUserId = loginResponse.body.data.userId;
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  describe("upSertProfileData", () => {
    it("should throw error if access token is not provided", async () => {
      const response = await upSertProfileData({}, "");
      expectUnauthorizedResponseForMissingAuthorizationHeader(response);
    });

    it("should return 401 for invalid authorization header", async () => {
      const response = await upSertProfileData({}, "invalid");
      expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
    });

    it("should throw an error if invalid access token is provided", async () => {
      const response = await upSertProfileData({}, "Bearer invalid-authorization");
      expectUnauthorizedResponseForInvalidToken(response);
    });

    it("should throw error if body is not provided", async () => {
      const response = await upSertProfileData({}, authorizationHeader);
      expectBadRequestResponseForValidationError(response);
    });

    it("should update profile data", async () => {
      const response = await upSertProfileData(profileData, authorizationHeader);
      expectProfileData(response, { userId: loggedInUserId, ...profileData });
    });
  });

  describe("Profile Visibility", () => {
    it("should update profile visibility to private", async () => {
      const response = await toggleProfileVisibility(false, authorizationHeader);
      expectProfileVisibility(response, false);
    });

    it("should update profile visibility to public", async () => {
      const response = await toggleProfileVisibility(true, authorizationHeader);
      expectProfileVisibility(response, true);
    });

    it("should reject invalid isPublic value", async () => {
      const response = await toggleProfileVisibility("not-a-boolean" as unknown as boolean, authorizationHeader);
      expectBadRequestResponseForValidationError(response);
    });

    it("should require authentication", async () => {
      const response = await toggleProfileVisibility(false, "");
      expectUnauthorizedResponseForMissingAuthorizationHeader(response);
    });
  });
});
