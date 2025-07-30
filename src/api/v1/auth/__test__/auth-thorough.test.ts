import {
  expectLoginSuccess,
  expectSignUpSuccess,
  expectUnauthorizedResponseForInvalidToken,
  getSessions,
  login,
  logoutOthers,
  logoutUser,
  renewToken,
  signUp,
} from "@/utils/test";

const VALID_CREDENTIALS = {
  username: "username",
  email: "validemail@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Thorough Testing for Auth APIs - Edge Cases and Security", () => {
  let refreshToken1: string;
  let refreshToken2: string;
  let sessionId1: string;

  beforeAll(async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);

    // Login twice to create two sessions
    const loginResponse1 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse1);
    refreshToken1 = loginResponse1.headers["refresh-token"];
    sessionId1 = loginResponse1.body.sessionId;

    const loginResponse2 = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse2);
    refreshToken2 = loginResponse2.headers["refresh-token"];
  });

  it("should reject logout with invalid token", async () => {
    const logoutResponse = await logoutUser("Bearer invalidtoken", "");
    expectUnauthorizedResponseForInvalidToken(logoutResponse);
  });

  it("should reject logoutOthers with invalid token", async () => {
    await expect(logoutOthers("Bearer invalidtoken", "")).rejects.toThrow();
  });

  it("should reject getSessions with invalid token", async () => {
    await expect(getSessions("Bearer invalidtoken")).rejects.toThrow();
  });

  it("should reject renewToken with expired or tampered token", async () => {
    // Assuming "expiredtoken" is a placeholder for an expired or tampered token
    await expect(renewToken("Bearer expiredtoken")).rejects.toThrow();
  });

  it("should handle concurrent logoutOthers requests gracefully", async () => {
    // Send multiple logoutOthers requests simultaneously
    const promises = [
      logoutOthers(`Bearer ${refreshToken1}`, sessionId1),
      logoutOthers(`Bearer ${refreshToken1}`, sessionId1),
      logoutOthers(`Bearer ${refreshToken2}`, sessionId1),
    ];
    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      expect(result.status).toBe("fulfilled");
    });
  });

  it("should handle concurrent renewToken requests gracefully", async () => {
    // Send multiple renewToken requests simultaneously
    const promises = [
      renewToken(`Bearer ${refreshToken1}`),
      renewToken(`Bearer ${refreshToken1}`),
      renewToken(`Bearer ${refreshToken2}`),
    ];
    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        expect(result.value.statusCode).toBe(200);
      }
    });
  });
});
