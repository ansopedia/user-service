import { success } from "@/api/v1/auth/auth.constant.js";
import { STATUS_CODES } from "@/constants";
import {
  expectLoginSuccess,
  expectLogoutSuccess,
  expectRenewTokenFailed,
  expectRenewTokenSuccess,
  expectSignUpSuccess,
  expectUnauthorizedResponseForInvalidToken,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  getSessions,
  login,
  logoutAllSessions,
  logoutOthers,
  renewToken,
  signUp,
  verifyAccount,
} from "@/utils/test";

const VALID_CREDENTIALS = {
  username: "testuser_session",
  email: "testuser_session@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Session Management APIs", () => {
  let refreshToken1: string;
  let refreshToken2: string;
  let authorizationHeader1: string;

  beforeAll(async () => {
    // Sign up and verify user
    const signUpResponse = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(signUpResponse);

    await verifyAccount(signUpResponse.body.data);

    // Login twice to create two sessions
    const loginResponse1 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse1);
    const headers1 = loginResponse1.headers;
    refreshToken1 = headers1["refresh-token"] as string;
    authorizationHeader1 = `Bearer ${headers1["authorization"] as string}`;

    const loginResponse2 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse2);
    const headers2 = loginResponse2.headers;
    refreshToken2 = headers2["refresh-token"] as string;
  });

  describe("logoutOthers", () => {
    it("should logout all other sessions except current session", async () => {
      // Use first session to logout others
      const logoutOthersResponse = await logoutOthers(authorizationHeader1);
      expectLogoutSuccess(logoutOthersResponse);

      // Verify current session (1) is still active
      const renewTokenRes1 = await renewToken(refreshToken1);
      expectRenewTokenSuccess(renewTokenRes1);

      // Verify other session (2) is inactive
      const renewTokenRes2 = await renewToken(refreshToken2);
      expectRenewTokenFailed(renewTokenRes2);
    });

    it("should handle logoutOthers when only one session exists", async () => {
      // Login once to have only one session
      const loginResponse = await login(VALID_CREDENTIALS);
      expectLoginSuccess(loginResponse);
      const authHeader = `Bearer ${loginResponse.headers["authorization"] as string}`;

      // Logout others (should not affect anything since no others)
      const logoutOthersResponse = await logoutOthers(authHeader);
      expectLogoutSuccess(logoutOthersResponse);

      // Verify session is still active
      const renewTokenRes = await renewToken(loginResponse.headers["refresh-token"] as string);
      expectRenewTokenSuccess(renewTokenRes);
    });

    it("should return error for invalid token", async () => {
      const logoutOthersResponse = await logoutOthers("Bearer invalidtoken");
      expectUnauthorizedResponseForInvalidToken(logoutOthersResponse);
    });

    it("should return error for missing authorization header", async () => {
      const logoutOthersResponse = await logoutOthers("");
      expectUnauthorizedResponseForMissingAuthorizationHeader(logoutOthersResponse);
    });
  });

  describe("getSessions", () => {
    beforeAll(async () => {
      // Login twice to create two sessions
      const loginResponse1 = await login(VALID_CREDENTIALS);
      expectLoginSuccess(loginResponse1);
      const headers1 = loginResponse1.headers;
      refreshToken1 = headers1["refresh-token"] as string;
      authorizationHeader1 = `Bearer ${headers1["authorization"] as string}`;

      const loginResponse2 = await login(VALID_CREDENTIALS);
      expectLoginSuccess(loginResponse2);
      const headers2 = loginResponse2.headers;
      refreshToken2 = headers2["refresh-token"] as string;
    });

    it("should return all active sessions for the user", async () => {
      const sessionsResponse = await getSessions(authorizationHeader1);

      expect(sessionsResponse.statusCode).toBe(STATUS_CODES.OK);
      expect(sessionsResponse.body).toMatchObject({
        message: success.SESSIONS_FETCHED_SUCCESSFULLY,
        status: "success",
        data: expect.any(Array),
      });

      const sessions = sessionsResponse.body.data;
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBeGreaterThanOrEqual(2);

      // Validate session structure
      sessions.forEach((session: unknown) => {
        expect(session).toMatchObject({
          _id: expect.any(String),
          userId: expect.any(String),
          deviceId: expect.any(String),
          deviceInfo: expect.any(Object),
          lastActive: expect.any(String), // ISO date string
          isActive: true,
          tokenVersion: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        expect((session as Record<string, unknown>).refreshToken).toBeUndefined(); // Should not expose refresh token
      });
    });

    it("should return error for invalid token", async () => {
      const sessionsResponse = await getSessions("Bearer invalidtoken");
      expectUnauthorizedResponseForInvalidToken(sessionsResponse);
    });

    it("should return error for missing authorization header", async () => {
      const sessionsResponse = await getSessions("");
      expectUnauthorizedResponseForMissingAuthorizationHeader(sessionsResponse);
    });
  });

  describe("logoutAll", () => {
    beforeAll(async () => {
      // Login twice to create two sessions
      const loginResponse1 = await login(VALID_CREDENTIALS);
      expectLoginSuccess(loginResponse1);
      const headers1 = loginResponse1.headers;
      refreshToken1 = headers1["refresh-token"] as string;
      authorizationHeader1 = `Bearer ${headers1["authorization"] as string}`;

      const loginResponse2 = await login(VALID_CREDENTIALS);
      expectLoginSuccess(loginResponse2);
      const headers2 = loginResponse2.headers;
      refreshToken2 = headers2["refresh-token"] as string;
    });

    it("should logout all sessions for the user", async () => {
      // Ensure multiple sessions exist
      await login(VALID_CREDENTIALS);
      await login(VALID_CREDENTIALS);

      const logoutAllResponse = await logoutAllSessions(authorizationHeader1);
      expectLogoutSuccess(logoutAllResponse);

      // Verify all sessions are inactive
      const renewTokenRes1 = await renewToken(refreshToken1);
      expectRenewTokenFailed(renewTokenRes1);

      const renewTokenRes2 = await renewToken(refreshToken2);
      expectRenewTokenFailed(renewTokenRes2);
    });

    it("should return error for invalid token", async () => {
      const logoutAllResponse = await logoutAllSessions("Bearer invalidtoken");
      expectUnauthorizedResponseForInvalidToken(logoutAllResponse);
    });
  });
});
