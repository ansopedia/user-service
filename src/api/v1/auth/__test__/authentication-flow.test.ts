import supertest from 'supertest';
import { app } from '../../../../server';
import { ErrorTypeEnum, errorMap } from '../../../../constants/errorTypes.constant';

import {
  expectLoginSuccess,
  expectOTPRequestSuccess,
  expectOTPVerificationSuccess,
  expectUserRetrievalSuccess,
  login,
  requestOTP,
  retrieveOTP,
  retrieveUser,
  verifyOTP,
} from '../../../../utils/test.util';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Authentication Flow', () => {
  beforeEach(async () => {
    await supertest(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);
  });

  it('should return 403 Forbidden for unverified email', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED];

    const { statusCode, body } = await login({ email: VALID_CREDENTIALS.email, password: VALID_CREDENTIALS.password });

    expect(statusCode).toBe(403);
    expect(body).toMatchObject({
      code: errorObject.body.code,
      message: errorObject.body.message,
      status: 'failed',
    });
  });

  it('should login with valid credentials', async () => {
    // Step 1: Request OTP
    const otpResponse = await requestOTP(VALID_CREDENTIALS.email);
    expectOTPRequestSuccess(otpResponse);

    // Step 2: Retrieve User from database
    const userResponse = await retrieveUser(VALID_CREDENTIALS.username);
    expectUserRetrievalSuccess(userResponse);

    // Step 2: Retrieve OTP from database
    const otpData = await retrieveOTP(userResponse.body.user.id);

    // Step 3: Verify OTP
    const verifyResponse = await verifyOTP(otpData?.otp, VALID_CREDENTIALS.email);
    expectOTPVerificationSuccess(verifyResponse);

    // Step 4: Login
    const loginResponse = await login({ email: VALID_CREDENTIALS.email, password: VALID_CREDENTIALS.password });
    expectLoginSuccess(loginResponse);
  });
});
