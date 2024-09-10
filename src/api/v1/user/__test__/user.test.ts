import supertest from 'supertest';
import { app } from '@/app';
import { success } from '../user.constant';
import { ErrorTypeEnum, STATUS_CODES, defaultUsers, errorMap } from '@/constants';
import {
  createUser,
  expectUserNotFoundError,
  expectFindUserByUsernameSuccess,
  expectLoginSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  expectUnauthorizedResponseWhenUserHasInsufficientPermission,
  expectUserCreationSuccess,
  findUserByUsername,
  login,
  verifyAccount,
} from '@/utils/test';

const newUser = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Test', () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;
  });

  it('should return 401 for missing authorization header', async () => {
    const response = await createUser(newUser, '');
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it('should return 401 for invalid authorization header', async () => {
    const response = await createUser(newUser, 'invalid');
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  it('should not create a new user without create-user permission', async () => {
    const unAuthorizedUser = { ...newUser, username: 'unauthorized', email: 'unauthorized@gmail.com' };

    const response = await createUser(unAuthorizedUser, authorizationHeader);
    expectUserCreationSuccess(response, unAuthorizedUser);

    await verifyAccount(unAuthorizedUser);

    const loginResponse = await login(unAuthorizedUser);
    expectLoginSuccess(loginResponse);
    const header = `Bearer ${loginResponse.header['authorization']}`;

    const newUserRes = await createUser(newUser, header);
    expectUnauthorizedResponseWhenUserHasInsufficientPermission(newUserRes);
  });

  it('should create a new user with valid credentials', async () => {
    const response = await createUser(newUser, authorizationHeader);
    expectUserCreationSuccess(response, newUser);
  });

  it('should respond with 409 for duplicate email', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS];
    const response = await createUser(newUser, authorizationHeader);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should respond with 409 for duplicate username', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS];
    const response = await createUser({ ...newUser, email: 'new@gmail.com' }, authorizationHeader);
    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should find user by username', async () => {
    const response = await findUserByUsername(newUser.username);
    expectFindUserByUsernameSuccess(response, newUser);
  });

  it('should respond with 404 for user not found', async () => {
    const response = await findUserByUsername('invalidUsername');
    expectUserNotFoundError(response);
  });

  it('should fetch all users', async () => {
    const response = await supertest(app).get('/api/v1/users');

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

  it('should restore deleted user', async () => {
    const newUser = {
      username: 'username1',
      email: 'validemail1@example.com',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    };

    const userResponse = await createUser(newUser, authorizationHeader);

    const response = await supertest(app).patch(`/api/v1/users/${userResponse.body.user.id}/restore`);

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    expect(body).toMatchObject({
      message: success.USER_RESTORED_SUCCESSFULLY,
      user: {
        id: expect.any(String),
        email: newUser.email,
        username: newUser.username,
      },
    });

    expect(body.user).not.toHaveProperty('password');
    expect(body.user).not.toHaveProperty('confirmPassword');
  });
});
