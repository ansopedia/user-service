import {
  expectBadRequestResponseForValidationError,
  expectLoginSuccess,
  expectProfileData,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForInvalidToken,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  login,
  upSertProfileData,
} from "@/utils/test";
import { defaultUsers } from "@/constants";
import { CreateProfileData } from "../profile.validation";

const profileData: CreateProfileData = {
  avatar: "http://avatar.com",
  bio: "bio",
  phoneNumber: "phoneNumber",
};

describe("Profile Service", () => {
  let authorizationHeader: string;
  let loggedInUserId: string;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    loggedInUserId = loginResponse.body.userId;
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
      const response = await upSertProfileData({}, "Bearer invalid-access-token");
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
});
