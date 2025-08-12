import {
  expectLoginSuccess,
  expectLogoutSuccess,
  expectSignUpSuccess,
  getSessions,
  login,
  logoutOthers,
  renewToken,
  signUp,
  verifyAccount,
} from "@/utils/test";

const VALID_CREDENTIALS = {
  username: "username",
  email: "validemail@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Session Management APIs - logoutOthers and getSessions", () => {
  let refreshToken1: string;
  let refreshToken2: string;
  let sessionId1: string;

  beforeAll(async () => {
    const signUpResponse = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(signUpResponse);

    await verifyAccount(signUpResponse.body.data);

    // Login twice to create two sessions
    const loginResponse1 = await login(VALID_CREDENTIALS);

    expectLoginSuccess(loginResponse1);
    refreshToken1 = loginResponse1.headers["refresh-token"];
    sessionId1 = loginResponse1.body.sessionId;

    const loginResponse2 = await login(VALID_CREDENTIALS);

    expectLoginSuccess(loginResponse2);
    refreshToken2 = loginResponse2.headers["refresh-token"];
  });

  it("should logout all other sessions except current session", async () => {
    // Use refreshToken1 session to logout others
    const logoutOthersResponse = await logoutOthers(`Bearer ${refreshToken1}`, sessionId1);
    expectLogoutSuccess(logoutOthersResponse);

    // The session with refreshToken1 should be invalidated
    // The session with refreshToken2 should still be valid
    // Try to renew token with refreshToken2 - should succeed
    const renewTokenRes2 = await renewToken(`Bearer ${refreshToken2}`);
    expectLoginSuccess(renewTokenRes2);

    // Try to renew token with refreshToken2 - should fail
    await expect(renewToken(`Bearer ${refreshToken1}`)).rejects.toThrow();
  });

  it("should return all active sessions for the user", async () => {
    // Login again to create multiple sessions
    const loginResponse1 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse1);

    const loginResponse2 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse2);

    // Use one of the refresh tokens to get sessions
    const sessionsResponse = await getSessions(`Bearer ${loginResponse1.headers["refresh-token"]}`);
    expect(sessionsResponse.statusCode).toBe(200);
    expect(Array.isArray(sessionsResponse.body.data)).toBe(true);
    expect(sessionsResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("should return error for invalid token in logoutOthers", async () => {
    await expect(logoutOthers("Bearer invalidtoken", "")).rejects.toThrow();
  });

  it("should return error for invalid token in getSessions", async () => {
    await expect(getSessions("Bearer invalidtoken")).rejects.toThrow();
  });
});
