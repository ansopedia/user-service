import { type Email, otpEvents } from "@ansospace/types";

import { defaultUsers } from "@/constants";
import {
  expectBadRequestResponseForValidationError,
  expectForgetPasswordSuccess,
  expectUserNotFoundError,
  requestOTP,
} from "@/utils/test";

describe("Forget Password", () => {
  it("should throw error if email is not provided", async () => {
    const res = await requestOTP({ email: "" as Email, eventType: otpEvents.enum.FORGET_PASSWORD });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is invalid", async () => {
    const res = await requestOTP({ email: "a" as Email, eventType: otpEvents.enum.FORGET_PASSWORD });
    expectBadRequestResponseForValidationError(res);
  });

  it("should throw error if email is not registered", async () => {
    const res = await requestOTP({ email: "a@a.com" as Email, eventType: otpEvents.enum.FORGET_PASSWORD });
    expectUserNotFoundError(res);
  });

  it("should send forget password email", async () => {
    const res = await requestOTP({ email: defaultUsers.email, eventType: otpEvents.enum.FORGET_PASSWORD });
    expectForgetPasswordSuccess(res);
  });
});
