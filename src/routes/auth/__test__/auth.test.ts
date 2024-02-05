import request from 'supertest';
import { app } from '../../../server';
import {
  ACCOUNT_DISABLED_ERROR,
  BASE_URL,
  EMAIL_ALREADY_EXISTS_ERROR,
  INVALID_CREDENTIALS_ERROR,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  STATUS_CODES,
  USER_NOT_FOUND_ERROR,
  VERIFY_ACCESS_TOKEN_ROUTE,
} from '../../../constants';
import {
  LOGGED_IN_SUCCESSFULLY,
  TOKEN_VERIFIED_SUCCESSFULLY,
  USER_CREATED_SUCCESSFULLY,
} from '../../../constants/messages/success';

// Define the valid and invalid credentials for reusability and scalability
const VALID_CREDENTIALS = {
  name: 'Valid User',
  email: 'validEmail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Registration Process', () => {
  it('should create a new user with valid credentials', async () => {
    const response = await request(app)
      .post(SIGN_UP_ROUTE)
      .send(VALID_CREDENTIALS);

    const { statusCode, header, body } = response;

    expect(statusCode).toBe(STATUS_CODES.CREATED);

    const authorizationHeader = header['authorization'];
    expect(authorizationHeader).toBeDefined();

    const setCookieHeader = response.get('set-cookie')[0];
    expect(setCookieHeader).toContain('refreshToken=');
    expect(setCookieHeader).toMatch(/HttpOnly; Secure/);

    expect(body).toMatchObject({
      message: USER_CREATED_SUCCESSFULLY,
    });
  });

  it('should respond with 422 for duplicate email', async () => {
    await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
    const response = await request(app)
      .post(SIGN_UP_ROUTE)
      .send(VALID_CREDENTIALS);
    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(EMAIL_ALREADY_EXISTS_ERROR);
  });
});

describe('Login Process', () => {
  it('should login with valid credentials', async () => {
    await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);

    const response = await request(app)
      .post(SIGN_IN_ROUTE)
      .send(VALID_CREDENTIALS);

    const { statusCode, header, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    const authorizationHeader = header['authorization'];
    expect(authorizationHeader).toBeDefined();

    const setCookieHeader = response.get('set-cookie')[0];
    expect(setCookieHeader).toContain('refreshToken=');
    expect(setCookieHeader).toMatch(/HttpOnly; Secure/);

    expect(body).toMatchObject({
      message: LOGGED_IN_SUCCESSFULLY,
    });
  });

  it('should respond with 404 when user not found', async () => {
    const response = await request(app).post(SIGN_IN_ROUTE).send({
      email: 'notRegistered@test.com',
      password: 'notRegistered123',
    });
    expect(response.statusCode).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.body.message).toBe(USER_NOT_FOUND_ERROR);
  });

  it('should respond with 401 for invalid credentials', async () => {
    await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
    const response = await request(app)
      .post(SIGN_IN_ROUTE)
      .send({
        ...VALID_CREDENTIALS,
        password: 'notRegistered123',
      });
    expect(response.statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
    expect(response.body.message).toBe(INVALID_CREDENTIALS_ERROR);
  });

  it('should respond with 403 when account is disabled', async () => {
    await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);

    const { header } = await request(app)
      .post(SIGN_IN_ROUTE)
      .send(VALID_CREDENTIALS);

    const authorizationHeader = `Bearer ${header['authorization']}`;

    const verificationResponse = await request(app)
      .get(VERIFY_ACCESS_TOKEN_ROUTE)
      .set('authorization', authorizationHeader);

    const disableUserRoute = `${BASE_URL}/user/${verificationResponse.body.userId}/status`;

    await request(app)
      .put(disableUserRoute)
      .send({
        isAccountDisabled: true,
      })
      .set('authorization', authorizationHeader);

    const response = await request(app)
      .post(SIGN_IN_ROUTE)
      .send(VALID_CREDENTIALS);

    expect(response.statusCode).toBe(STATUS_CODES.FORBIDDEN);
    expect(response.body.message).toBe(ACCOUNT_DISABLED_ERROR);
  });
});

describe('access token verification', () => {
  it('should respond with 200 when access token is valid', async () => {
    const user = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'Test1234',
      confirmPassword: 'Test1234',
    };

    await request(app).post(SIGN_UP_ROUTE).send(user);

    const response = await request(app).post(SIGN_IN_ROUTE).send(user);

    const authorizationHeader = `Bearer ${response.header['authorization']}`;

    const verificationResponse = await request(app)
      .get(VERIFY_ACCESS_TOKEN_ROUTE)
      .set('authorization', authorizationHeader);

    const { statusCode, body } = verificationResponse;

    expect(statusCode).toBe(STATUS_CODES.OK);
    expect(body.message).toBe(TOKEN_VERIFIED_SUCCESSFULLY);
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('role');
  });
});
