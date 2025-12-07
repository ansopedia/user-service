import { type Email, NotificationType } from "@ansospace/types";

import { defaultUsers } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectForgetPasswordSuccess,
  expectUserNotFoundError,
  requestOTP,
} from "@/utils/test";

describe("Forget Password", () => {
  it("should throw error if email is not provided", async () => {
    const res = await requestOTP({ email: "" as Email, otpType: NotificationType.FORGET_PASSWORD_OTP });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is invalid", async () => {
    const res = await requestOTP({ email: "a" as Email, otpType: NotificationType.FORGET_PASSWORD_OTP });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is not registered", async () => {
    const res = await requestOTP({ email: "a@a.com" as Email, otpType: NotificationType.FORGET_PASSWORD_OTP });
    expectUserNotFoundError(res);
  });

  it("should send forget password email", async () => {
    const res = await requestOTP({ email: defaultUsers.email, otpType: NotificationType.FORGET_PASSWORD_OTP });
    expectForgetPasswordSuccess(res);
  });
});
