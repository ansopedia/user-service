import request from 'supertest';
import { app } from '../../../../server';
import { STATUS_CODES } from '../../../../constants/statusCode.constant';
import { success } from '../auth.constant';
import { ErrorTypeEnum, errorMap } from '../../../../constants/errorTypes.constant';
import { sign } from 'jsonwebtoken';
import { envConstants } from '../../../../constants';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Auth Test', () => {
  it('should sign up a user & send verification email', async () => {
    const response = await request(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);

    const { statusCode, body } = response;
    expect(statusCode).toBe(STATUS_CODES.CREATED);

    expect(body).toMatchObject({
      message: success.SIGN_UP_SUCCESS,
    });
  });

  it('should login with valid credentials', async () => {
    await request(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);

    const response = await request(app).post('/api/v1/auth/login').send(VALID_CREDENTIALS);

    const { statusCode, header, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    const authorizationHeader = header['authorization'];
    expect(authorizationHeader).toBeDefined();

    const setCookieHeader = response.get('set-cookie')[0];
    expect(setCookieHeader).toContain('refresh-token=');
    expect(setCookieHeader).toMatch(/HttpOnly; Secure/);

    expect(body).toMatchObject({
      message: success.LOGGED_IN_SUCCESSFULLY,
      status: 'success',
    });
  });

  it('should respond with 404 when user not found', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];
    const response = await request(app).post('/api/v1/auth/login').send({
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

    await request(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
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

  it('should logout a user', async () => {
    await request(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);

    const loginResponse = await request(app).post('/api/v1/auth/login').send(VALID_CREDENTIALS);

    const authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;

    const response = await request(app).post('/api/v1/auth/logout').set('authorization', authorizationHeader);

    expect(response.statusCode).toBe(STATUS_CODES.OK);
    expect(response.body).toMatchObject({
      message: success.LOGGED_OUT_SUCCESSFULLY,
      status: 'success',
    });
  });

  it('should renew token', async () => {
    await request(app).post('/api/v1/auth/sign-up').send(VALID_CREDENTIALS);

    const loginResponse = await request(app).post('/api/v1/auth/login').send(VALID_CREDENTIALS);

    const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].replace('refresh-token=', '');

    const response = await request(app).post('/api/v1/auth/token').set('authorization', `Bearer ${refreshToken}`);

    expect(response.statusCode).toBe(STATUS_CODES.OK);
    expect(response.body).toMatchObject({
      status: 'success',
    });
  });

  it('should respond with 401 for invalid token', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_TOKEN];

    const response = await request(app).post('/api/v1/auth/token').set('authorization', 'Bearer invalidToken');

    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should throw an error if the token is invalid', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.INVALID_TOKEN];

    // Call the function that uses verifyToken with an invalid token
    const invalidToken = 'invalidToken';
    const response = await request(app).post('/api/v1/auth/token').set('authorization', `Bearer ${invalidToken}`);

    // Expect an error to be thrown
    expect(response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should throw an error if the token is expired', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.TOKEN_EXPIRED];

    const newUserRes = await request(app).post('/api/v1/users').send({
      username: 'newUserRes',
      email: 'newUserRes@example.com',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });

    // Mock verifyToken to throw a TokenExpiredError
    const refreshToken = sign({ id: newUserRes.body.user.id }, envConstants.JWT_REFRESH_SECRET, { expiresIn: '0s' });

    const response = await request(app).post('/api/v1/auth/token').set('authorization', `Bearer ${refreshToken}`);

    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });
});
