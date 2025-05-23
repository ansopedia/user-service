import { ZodError } from "zod";

import { EmailEventType } from "../../../../services";
import { TokenAction } from "../../token";
import { OtpEvent, otpEvent } from "../otp.validation";

describe("Test OTP validation", () => {
  const otpTypes: OtpEvent = {
    otpType: EmailEventType.sendEmailVerificationOTP,
    email: "example@gmail.com",
    actionTokenType: TokenAction.verifyEmail,
  };

  it("should validate sendOtpSchema", () => {
    const res = otpEvent.safeParse(otpTypes);
    expect(res.success).toBe(true);
  });

  it(`should throw error if email is not provided with otpType of ${EmailEventType.sendEmailVerificationOTP}`, () => {
    const otpTypesWithoutEmail = { ...otpTypes, email: undefined };

    try {
      otpEvent.parse(otpTypesWithoutEmail);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe("Required");
      expect((error as ZodError).errors[0].path).toEqual(["email"]);
    }
  });

  it("should throw error if phone number is not provided", () => {
    const otpTypesWithoutPhoneNumber = { otpType: "verifyPhoneNumber" };

    try {
      otpEvent.parse(otpTypesWithoutPhoneNumber);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe("Required");
      expect((error as ZodError).errors[0].path).toEqual(["phoneNumber"]);
    }
  });
});
