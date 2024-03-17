import request from 'supertest';
import { app } from '../../../../server';
import { STATUS_CODES } from '../../../../constants/statusCode.constant';
import { success } from '../user.constant';
import { ErrorTypeEnum, errorMap } from '../../../../constants/errorTypes.constant';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Test', () => {
  it('should create a new user with valid credentials', async () => {
    const response = await request(app).post('/api/v1/users').send(VALID_CREDENTIALS);

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.CREATED);

    expect(body).toMatchObject({
      message: success.USER_CREATED_SUCCESSFULLY,
      user: {
        id: expect.any(String),
        email: VALID_CREDENTIALS.email,
        username: VALID_CREDENTIALS.username,
      },
    });

    expect(body.user).not.toHaveProperty('password');
    expect(body.user).not.toHaveProperty('confirmPassword');
  });

  it('should respond with 409 for duplicate email', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS];
    const response = await request(app).post('/api/v1/users').send(VALID_CREDENTIALS);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should find user by username', async () => {
    const response = await request(app).get(`/api/v1/users/${VALID_CREDENTIALS.username}`);

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    expect(body).toMatchObject({
      message: success.USER_FETCHED_SUCCESSFULLY,
      user: {
        id: expect.any(String),
        email: VALID_CREDENTIALS.email,
        username: VALID_CREDENTIALS.username,
      },
    });

    expect(body.user).not.toHaveProperty('password');
    expect(body.user).not.toHaveProperty('confirmPassword');
  });

  it('should respond with 404 for user not found', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];
    const response = await request(app).get('/api/v1/users/invalidUsername');

    expect(response.statusCode).toBe(STATUS_CODES.NOT_FOUND);

    expect(response.body).toMatchObject({
      message: errorObject.body.message,
      code: errorObject.body.code,
      status: 'failed',
    });
  });

  it('should fetch all users', async () => {
    const response = await request(app).get('/api/v1/users');

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    expect(body).toMatchObject({
      message: success.USER_FETCHED_SUCCESSFULLY,
      users: expect.any(Array),
    });

    if (body.users.length > 0) {
      expect(body.users[0]).not.toHaveProperty('password');
      expect(body.users[0]).not.toHaveProperty('confirmPassword');
    }
  });
});
