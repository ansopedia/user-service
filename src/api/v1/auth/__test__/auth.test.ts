import request from 'supertest';
import { app } from '../../../../server';
import { STATUS_CODES } from '../../../../constants/statusCode.constant';
import { success } from '../auth.constant';

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Auth Test', () => {
  it('should sign up a user & send verification email', async () => {
    const response = await request(app).post('/api/v1/sign-up').send(VALID_CREDENTIALS);

    const { statusCode, body } = response;
    expect(statusCode).toBe(STATUS_CODES.CREATED);

    expect(body).toMatchObject({
      message: success.SIGN_UP_SUCCESS,
    });
  });
});
