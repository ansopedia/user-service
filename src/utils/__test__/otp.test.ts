import { generateOTP, verifyOTP } from "@/utils";

describe("OTP validation", () => {
  test("generateOTP generates an OTP of the correct length", () => {
    const length = 6;
    const otp = generateOTP(length);
    expect(otp.length).toBe(length);
  });

  test("verifyOTP returns true when the OTPs match", () => {
    const otp = generateOTP();
    expect(verifyOTP(otp, otp)).toBe(true);
  });

  test("verifyOTP returns false when the OTPs do not match", () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();
    expect(verifyOTP(otp1, otp2)).toBe(false);
  });
});
