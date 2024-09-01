import { ErrorTypeEnum, STATUS_CODES, errorMap } from '@/constants';
import {
  expectLoginSuccess,
  expectLogoutSuccess,
  expectRenewTokenSuccess,
  expectSignUpSuccess,
  login,
  logoutUser,
  renewToken,
  signUp,
  verifyAccount,
} from '@/utils/test';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Authentication Flow', () => {
  it('should sign up a user', async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);
  });

  it('should return 403 Forbidden for unverified email', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED];

    const { statusCode, body } = await login({ email: VALID_CREDENTIALS.email, password: VALID_CREDENTIALS.password });

    expect(statusCode).toBe(STATUS_CODES.FORBIDDEN);
    expect(body).toMatchObject({
      code: errorObject.body.code,
      message: errorObject.body.message,
      status: 'failed',
    });
  });

  it('should verify email', async () => {
    await verifyAccount(VALID_CREDENTIALS);
  });

  it('should login with email and password', async () => {
    const loginResponse = await login({ email: VALID_CREDENTIALS.email, password: VALID_CREDENTIALS.password });
    expectLoginSuccess(loginResponse);
  });

  it('should login with username and password', async () => {
    const loginResponse = await login({ username: VALID_CREDENTIALS.username, password: VALID_CREDENTIALS.password });
    expectLoginSuccess(loginResponse);
  });

  it('should logout a user', async () => {
    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);

    const authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;

    const logoutResponse = await logoutUser(authorizationHeader);
    expectLogoutSuccess(logoutResponse);
  });

  it('should renew token', async () => {
    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);

    const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].replace('refresh-token=', '');

    const renewTokenRes = await renewToken(`Bearer ${refreshToken}`);
    expectRenewTokenSuccess(renewTokenRes);
  });
});
