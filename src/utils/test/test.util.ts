import supertest, { Response } from 'supertest';
import { OTP, OtpSchema } from '../../api/v1/otp/otp.validation';
import { app } from '../../server';
import { STATUS_CODES } from '../../constants/statusCode.constant';
import { success } from '../../api/v1/auth/auth.constant';
import { OtpDAL } from '../../api/v1/otp/otp.dal';
import { Login } from '../../api/v1/auth/auth.validation';

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

export async function retrieveUser(username: string): Promise<Response> {
  return supertest(app).get(`/api/v1/users/${username}`);
}

export function expectUserRetrievalSuccess(response: Response): void {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
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

export async function login(loginData: Login): Promise<Response> {
  return supertest(app).post('/api/v1/auth/login').send(loginData);
}

export function expectLoginSuccess(response: Response): void {
  const { statusCode, headers, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);

  const authorizationHeader = headers['authorization'];
  expect(authorizationHeader).toBeDefined();

  const setCookieHeader = response.get('set-cookie')?.[0];
  expect(setCookieHeader).toContain('refresh-token=');
  expect(setCookieHeader).toMatch(/HttpOnly; Secure/);

  expect(body).toMatchObject({
    message: success.LOGGED_IN_SUCCESSFULLY,
    status: 'success',
  });
}
