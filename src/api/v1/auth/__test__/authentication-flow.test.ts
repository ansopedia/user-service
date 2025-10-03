import type { SignUpResponse } from "@ansospace/types";

import { ErrorTypeEnum, STATUS_CODES, errorMap, mockUser } from "@/constants";
import {
  expectLoginSuccess,
  expectLogoutSuccess,
  expectRenewTokenFailed,
  expectRenewTokenSuccess,
  expectSignUpSuccess,
  login,
  logoutAllSessions,
  logoutUser,
  renewToken,
  signUp,
  verifyAccount,
} from "@/utils/test";

describe("Authentication Flow", () => {
  let signUpResponse: SignUpResponse;
  it("should sign up a user", async () => {
    const response = await signUp(mockUser);
    expectSignUpSuccess(response);
    signUpResponse = response.body.data;
  });

  it("should return 403 Forbidden for unverified email", async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED];

    const { statusCode, body } = await login({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(statusCode).toBe(STATUS_CODES.FORBIDDEN);
    expect(body).toMatchObject({
      code: errorObject.body.code,
      message: errorObject.body.message,
      status: "failed",
    });
  });

  it("should verify email", async () => {
    await verifyAccount(signUpResponse);
  });

  it("should login with email and password", async () => {
    const loginResponse = await login({
      email: mockUser.email,
      password: mockUser.password,
    });
    expectLoginSuccess(loginResponse);
  });

  it("should login with username and password", async () => {
    const loginResponse = await login({
      username: mockUser.username,
      password: mockUser.password,
    });
    expectLoginSuccess(loginResponse);
  });

  it("should logout a user from a single session", async () => {
    const loginResponse1 = await login(mockUser);
    expectLoginSuccess(loginResponse1);

    const loginResponse2 = await login(mockUser);
    expectLoginSuccess(loginResponse2);

    // Logout from first session using refresh token
    const authorizationHeader1 = loginResponse1.headers["authorization"];

    const logoutResponse = await logoutUser(`Bearer ${authorizationHeader1}`);
    expectLogoutSuccess(logoutResponse);

    // Renew token for second session should still succeed
    const refreshToken2 = loginResponse2.headers["refresh-token"];
    const renewTokenRes = await renewToken(refreshToken2);
    expectRenewTokenSuccess(renewTokenRes);
  });

  it("should logout a user from all sessions", async () => {
    const loginResponse1 = await login(mockUser);
    expectLoginSuccess(loginResponse1);

    const loginResponse2 = await login(mockUser);
    expectLoginSuccess(loginResponse2); // Logout from first session using refresh token

    const authorizationHeader1 = loginResponse1.headers["authorization"];

    // Logout from all sessions (no refresh token provided)
    const logoutResponse = await logoutAllSessions(`Bearer ${authorizationHeader1}`); // No refresh token
    expectLogoutSuccess(logoutResponse);

    // Renew token for both sessions should fail
    const refreshToken1 = loginResponse1.headers["refresh-token"];
    const refreshToken2 = loginResponse2.headers["refresh-token"];

    const refreshTokenRes = await renewToken(refreshToken1);
    expectRenewTokenFailed(refreshTokenRes);

    const refreshTokenRes2 = await renewToken(refreshToken2);
    expectRenewTokenFailed(refreshTokenRes2);
  });

  it("should renew token", async () => {
    const loginResponse = await login(mockUser);
    expectLoginSuccess(loginResponse);

    const refreshToken = loginResponse.headers["refresh-token"];

    const renewTokenRes = await renewToken(refreshToken);
    expectRenewTokenSuccess(renewTokenRes);
  });
});
