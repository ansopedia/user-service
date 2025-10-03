import { defaultUsers, mockUser } from "@/constants";
import {
  checkUsernameAvailability,
  createUser,
  expectBadRequestResponseForValidationError,
  expectLoginSuccess,
  expectUserCreationSuccess,
  expectUsernameAvailabilityResponse,
  login,
} from "@/utils/test";

describe("Check Username Availability", () => {
  let authorizationHeader: string;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;

    // Create a user to test username unavailability
    const userResponse = await createUser(mockUser, authorizationHeader);
    expectUserCreationSuccess(userResponse, mockUser);
  });

  it("should return true for available username", async () => {
    const response = await checkUsernameAvailability("availableuser");
    expectUsernameAvailabilityResponse(response, true);
  });

  it("should return false for unavailable username", async () => {
    const response = await checkUsernameAvailability(mockUser.username);
    expectUsernameAvailabilityResponse(response, false);
  });

  it("should validate username format - too short", async () => {
    const response = await checkUsernameAvailability("ab");
    expectBadRequestResponseForValidationError(response);
  });

  it("should validate username format - too long", async () => {
    const response = await checkUsernameAvailability("thisusernameistoolong123");
    expectBadRequestResponseForValidationError(response);
  });

  it("should validate username format - invalid characters", async () => {
    const response = await checkUsernameAvailability("user@name");
    expectBadRequestResponseForValidationError(response);
  });

  it("should validate username format - starts with number", async () => {
    const response = await checkUsernameAvailability("123user");
    expectBadRequestResponseForValidationError(response);
  });
});
