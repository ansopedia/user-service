import { sign } from 'jsonwebtoken';
import { envConstants, errorMap, ErrorTypeEnum, STATUS_CODES } from '@/constants';
import { expectSignUpSuccess, login, renewToken, signUp } from '@/utils/test';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Auth Test', () => {
  it('should respond with 404 when user not found', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];
    const response = await login({
      email: 'notRegistered@test.com',
      password: 'notRegistered123',
    });

    expect(response.statusCode).toBe(STATUS_CODES.NOT_FOUND);

    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should respond with 401 for invalid credentials', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_CREDENTIALS];

    const res = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(res);

    const response = await login({
      ...VALID_CREDENTIALS,
      password: 'notRegistered123',
    });
    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should respond with 401 for invalid token', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_TOKEN];

    const response = await renewToken('Bearer invalidToken');

    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should throw an error if the token is invalid', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_TOKEN];

    const response = await renewToken(`Bearer invalidToken`);

    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should throw an error if the token is expired', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.TOKEN_EXPIRED];

    const loginResponse = await login(VALID_CREDENTIALS);

    // Mock verifyToken to throw a TokenExpiredError
    const refreshToken = sign({ id: loginResponse.body.userId }, envConstants.JWT_REFRESH_SECRET, { expiresIn: '0s' });

    const response = await renewToken(`Bearer ${refreshToken}`);

    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });
});
