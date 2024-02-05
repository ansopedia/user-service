import request from 'supertest';
import {
  GET_USER_ROUTE,
  SIGN_UP_ROUTE,
  STATUS_CODES,
} from '../../../constants';
import { app } from '../../../server';
import { USER_FOUND_SUCCESSFULLY } from '../../../constants/messages/success';

const VALID_CREDENTIALS = {
  name: 'Valid User',
  email: 'validEmail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Management Process', () => {
  it('should get user details by id', async () => {
    const signUpResponse = await request(app)
      .post(SIGN_UP_ROUTE)
      .send(VALID_CREDENTIALS);

    const { statusCode: signUpStatusCode } = signUpResponse;

    expect(signUpStatusCode).toBe(STATUS_CODES.CREATED);

    const authorizationHeader = `Bearer ${signUpResponse.header['authorization']}`;

    // Fetch user details:
    const fetchUserResponse = await request(app)
      .get(GET_USER_ROUTE)
      .set('authorization', authorizationHeader);

    const { statusCode: fetchUserStatusCode, body: fetchUserBody } =
      fetchUserResponse;
    const user = fetchUserBody.user;

    expect(fetchUserStatusCode).toBe(STATUS_CODES.OK);
    expect(fetchUserBody.message).toBe(USER_FOUND_SUCCESSFULLY);
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('isAccountVerified');
    expect(typeof user.isAccountVerified).toBe('boolean');
    expect(user).toHaveProperty('isProfileComplete');
    expect(typeof user.isProfileComplete).toBe('boolean');
  });
});
