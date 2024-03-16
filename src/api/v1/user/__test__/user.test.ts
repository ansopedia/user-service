import request from 'supertest';
import { app } from '../../../../server';
import { STATUS_CODES } from '../../../../constants/statusCode.constant';
import { success } from '../user.constant';
import { ErrorTypeEnum, errorMap } from '../../../../constants/errorTypes.constant';

const VALID_CREDENTIALS = {
  username: 'validUserName',
  email: 'validEmail@example.com',
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
    });
  });

  it('should respond with 409 for duplicate email', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS];
    const response = await request(app).post('/api/v1/users').send(VALID_CREDENTIALS);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });
});
