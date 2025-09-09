import type { Response } from "supertest";

import { NotificationType, envConstants } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectForgetPasswordSuccess,
  expectLoginFailed,
  expectLoginSuccess,
  expectOTPVerificationSuccess,
  expectResetPasswordSuccess,
  expectSignUpSuccess,
  forgetPassword,
  login,
  resetPassword,
  signUp,
  verifyAccount,
  verifyOTP,
} from "@/utils/test";

const user = {
  username: "username",
  email: "validemail@example.com",
  password: "ValidPassword123!",
  confirmPassword: "ValidPassword123!",
};

describe("Reset Password", () => {
  beforeAll(async () => {
    const signUpResponse = await signUp(user);
    expectSignUpSuccess(signUpResponse);

    verifyAccount(signUpResponse.body.data);
  });

  it("should throw error if token, password, confirmPassword is not provided", async () => {
    const res = await resetPassword({
      token: "",
      password: "",
      confirmPassword: "",
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if token is invalid", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a",
      confirmPassword: "a",
    });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if password and confirmPassword do not match", async () => {
    const res = await resetPassword({
      token: "a",
      password: "a",
      confirmPassword: "b",
    });
    expectBadRequestResponseForValidationError(res);
  });

  // should reset password again after isUsed flag is reset
  let verifiedOTPResponse: Response;
  it("should verify OTP successfully", async () => {
    const res = await forgetPassword(user.email);
    expectForgetPasswordSuccess(res);

    const otpType = NotificationType.FORGET_PASSWORD_OTP;

    verifiedOTPResponse = await verifyOTP({
      otp: envConstants.MASTER_OTP,
      token: res.body.data.token,
      otpType,
    });
    expectOTPVerificationSuccess(otpType, verifiedOTPResponse);
  });

  it("should reset password successfully", async () => {
    const { actionToken } = verifiedOTPResponse.body.data;

    const res = await resetPassword({
      token: actionToken,
      password: "ValidPassword123@",
      confirmPassword: "ValidPassword123@",
    });
    expectResetPasswordSuccess(res);
  });

  it("should not login with old password", async () => {
    const res = await login(user);
    expectLoginFailed(res);
  });

  it("should login with new password", async () => {
    const res = await login({ ...user, password: "ValidPassword123@" });
    expectLoginSuccess(res);
  });
});
