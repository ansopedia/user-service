import { ZodError } from 'zod';
import { OtpEvent, otpEvent } from '../otp.validation';

describe('Test OTP validation', () => {
  const otpTypes: OtpEvent = {
    otpType: 'verifyEmail',
    email: 'example@gmail.com',
  };

  it('should validate sendOtpSchema', () => {
    const res = otpEvent.safeParse(otpTypes);
    expect(res.success).toBe(true);
  });

  it('should throw error if email is not provided with otpType of "verifyEmail"', () => {
    const otpTypesWithoutEmail = { ...otpTypes, email: undefined };

    try {
      otpEvent.parse(otpTypesWithoutEmail);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe('Email is required');
    }
  });

  it('should throw error if phone number is not provided', () => {
    const otpTypesWithoutPhoneNumber = { otpType: 'verifyPhoneNumber' };

    try {
      otpEvent.parse(otpTypesWithoutPhoneNumber);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe('Phone number is required');
    }
  });

  it('should throw error if phone number is invalid', () => {
    const otpTypesWithInvalidPhoneNumber = { otpType: 'verifyPhoneNumber', phoneNumber: '1234567890' };

    try {
      otpEvent.parse(otpTypesWithInvalidPhoneNumber);
    } catch (error) {
      expect((error as ZodError).errors[0].message).toBe('Invalid Phone number');
    }
  });
});
