import supertest, { Response } from 'supertest';
import { app } from '@/server';
import { STATUS_CODES } from '@/constants';
import { success } from '@/api/v1/auth/auth.constant';
import { OtpDAL } from '@/api/v1/otp/otp.dal';
import { OTP, OtpSchema } from '@/api/v1/otp/otp.validation';

export async function requestOTP(email: string): Promise<Response> {
  return supertest(app).post('/api/v1/otp').send({
    otpType: 'sendEmailVerificationOTP',
    email,
  });
}

export function expectOTPRequestSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.VERIFICATION_EMAIL_SENT);
}

export async function retrieveOTP(userId: string): Promise<OtpSchema | null> {
  return OtpDAL.getOtp({
    userId: userId,
    otpType: 'sendEmailVerificationOTP',
  });
}

export async function verifyOTP(otp: OTP | undefined, email: string): Promise<Response> {
  return supertest(app).post('/api/v1/otp/verify').send({
    otpType: 'sendEmailVerificationOTP',
    email,
    otp,
  });
}

export function expectOTPVerificationSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.OTP_VERIFIED);
}
