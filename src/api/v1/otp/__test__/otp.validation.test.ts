import { type SendOtpRequest, emailSchema, otpEvents, sendOtpRequestSchema } from "@ansospace/types";
import { ZodError } from "zod/v4";

describe("Test OTP validation", () => {
  const otpTypes: SendOtpRequest = {
    eventType: otpEvents.enum.EMAIL_VERIFICATION,
    email: emailSchema.parse("example@gmail.com"),
  };

  it(`should throw error if email is not provided with otpType of ${otpEvents.enum.EMAIL_VERIFICATION}`, () => {
    const otpTypesWithoutEmail = { ...otpTypes, email: undefined };

    try {
      sendOtpRequestSchema.parse(otpTypesWithoutEmail);
    } catch (error) {
      expect((error as ZodError).issues[0].message).toBe("Invalid email format");
      expect((error as ZodError).issues[0].path).toEqual(["email"]);
    }
  });

  // it("should throw error if phone number is not provided", () => {
  //   const otpTypesWithoutPhoneNumber = { otpType: NotificationType.PHONE_VERIFICATION };

  //   try {
  //     otpEvent.parse(otpTypesWithoutPhoneNumber);
  //   } catch (error) {
  //     expect((error as ZodError).errors[0].message).toBe("Required");
  //     expect((error as ZodError).errors[0].path).toEqual(["phoneNumber"]);
  //   }
  // });
});
