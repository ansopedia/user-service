import { ErrorTypeEnum, STATUS_CODES, errorMap } from "@/constants";
import {
  expectLoginSuccess,
  expectLogoutSuccess,
  expectRenewTokenSuccess,
  expectSignUpSuccess,
  login,
  logoutAllSessions,
  logoutUser,
  renewToken,
  signUp,
  verifyAccount,
} from "@/utils/test";

import type { SignUpResponse } from "../auth.validation.js";

const VALID_CREDENTIALS = {
  username: "username",
  email: "validemail@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Authentication Flow", () => {
  let signUpResponse: SignUpResponse;
  it("should sign up a user", async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);
    signUpResponse = response.body.data;
  });

  it("should return 403 Forbidden for unverified email", async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED];

    const { statusCode, body } = await login({
      email: VALID_CREDENTIALS.email,
      password: VALID_CREDENTIALS.password,
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
      email: VALID_CREDENTIALS.email,
      password: VALID_CREDENTIALS.password,
    });
    expectLoginSuccess(loginResponse);
  });

  it("should login with username and password", async () => {
    const loginResponse = await login({
      username: VALID_CREDENTIALS.username,
      password: VALID_CREDENTIALS.password,
    });
    expectLoginSuccess(loginResponse);
  });

  it("should logout a user from a single session", async () => {
    const loginResponse1 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse1);

    const loginResponse2 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse2);

    // Logout from first session using refresh token
    const authorizationHeader1 = loginResponse1.headers["authorization"];
    const sessionId1 = loginResponse1.body.sessionId;

    const logoutResponse = await logoutUser(`Bearer ${authorizationHeader1}`, sessionId1);
    expectLogoutSuccess(logoutResponse);

    // Renew token for second session should still succeed
    const refreshToken2 = loginResponse2.headers["refresh-token"];
    const renewTokenRes = await renewToken(`Bearer ${refreshToken2}`);
    expectRenewTokenSuccess(renewTokenRes);
  });

  it("should logout a user from all sessions", async () => {
    const loginResponse1 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse1);

    const loginResponse2 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse2); // Logout from first session using refresh token

    const authorizationHeader1 = loginResponse1.headers["authorization"];

    // Logout from all sessions (no refresh token provided)
    const logoutResponse = await logoutAllSessions(authorizationHeader1); // No refresh token
    expectLogoutSuccess(logoutResponse);

    // Renew token for both sessions should fail
    const refreshToken1 = loginResponse1.headers["refresh-token"];
    const refreshToken2 = loginResponse2.headers["refresh-token"];

    await expect(renewToken(`Bearer ${refreshToken1}`)).rejects.toThrow();
    await expect(renewToken(`Bearer ${refreshToken2}`)).rejects.toThrow();
  });

  it("should renew token", async () => {
    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);

    const refreshToken = loginResponse.headers["refresh-token"];

    const renewTokenRes = await renewToken(`Bearer ${refreshToken}`);
    expectRenewTokenSuccess(renewTokenRes);
  });
});
