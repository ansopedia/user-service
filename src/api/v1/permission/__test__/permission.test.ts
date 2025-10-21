import { defaultUsers } from "@/constants";
import {
  expectGetPermissionsSuccess,
  expectLoginSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  getPermissionsRequest,
  login,
} from "@/utils/test";

describe("Permission Service", () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should not get all permissions without authorization header", async () => {
    const response = await getPermissionsRequest("");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("should not get all permissions with invalid authorization header", async () => {
    const response = await getPermissionsRequest("invalid");
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  it("should get all permissions", async () => {
    const response = await getPermissionsRequest(authorizationHeader);
    expectGetPermissionsSuccess(response);
  });
});
