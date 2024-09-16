import {
  expectBadRequestResponseForValidationError,
  expectFindUserByUsernameSuccess,
  expectForgetPasswordSuccess,
  expectLoginFailed,
  expectLoginSuccess,
  expectOTPVerificationSuccess,
  expectResetPasswordSuccess,
  expectSignUpSuccess,
  findUserByUsername,
  forgetPassword,
  login,
  resetPassword,
  retrieveOTP,
  signUp,
  verifyAccount,
  verifyOTP,
} from '@/utils/test';
import { Response } from 'supertest';
import { GetUser } from '../../user/user.validation';

const user = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Reset Password', () => {
  beforeAll(async () => {
    const response = await signUp(user);
    expectSignUpSuccess(response);

    verifyAccount(user);
  });

  it('should throw error if token, password, confirmPassword is not provided', async () => {
    const res = await resetPassword({ token: '', password: '', confirmPassword: '' });
    expectBadRequestResponseForValidationError(res);
  });

  it('should throw error if token is invalid', async () => {
    const res = await resetPassword({ token: 'a', password: 'a', confirmPassword: 'a' });
    expectBadRequestResponseForValidationError(res);
  });

  it('should throw error if password and confirmPassword do not match', async () => {
    const res = await resetPassword({ token: 'a', password: 'a', confirmPassword: 'b' });
    expectBadRequestResponseForValidationError(res);
  });

  // Running these test twice to ensure that after user can successfully reset password
  // should reset password again after isUsed flag is reset
  for (let i = 0; i < 2; i++) {
    let verifiedOTPResponse: Response;

    it('should verify OTP successfully', async () => {
      const res = await forgetPassword(user.email);
      expectForgetPasswordSuccess(res);

      const userResponse = await findUserByUsername(user.username);
      expectFindUserByUsernameSuccess(userResponse, user);
      const userDetails: GetUser = userResponse.body.user;

      const otpData = await retrieveOTP(userDetails.id, 'sendForgetPasswordOTP');
      verifiedOTPResponse = await verifyOTP(otpData, user.email);
      expectOTPVerificationSuccess(verifiedOTPResponse);
    });

    it('should reset password successfully', async () => {
      const { token } = verifiedOTPResponse.body;

      const res = await resetPassword({ token, password: 'ValidPassword123@', confirmPassword: 'ValidPassword123@' });
      expectResetPasswordSuccess(res);
    });

    it('should not login with old password', async () => {
      const res = await login(user);
      expectLoginFailed(res);
    });

    it('should login with new password', async () => {
      const res = await login({ ...user, password: 'ValidPassword123@' });
      expectLoginSuccess(res);
    });
  }
});
