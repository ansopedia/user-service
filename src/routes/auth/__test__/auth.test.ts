import request from 'supertest';
import { app } from '../../../server';
import {
  SIGN_UP_ROUTE,
  SIGN_IN_ROUTE,
  EMAIL_ALREADY_EXISTS_ERROR,
  INVALID_CREDENTIALS_ERROR,
  USER_NOT_FOUND_ERROR,
  STATUS_CODES,
} from '../../../constants';
import {
  LOGGED_IN_SUCCESSFULLY,
  USER_CREATED_SUCCESSFULLY,
} from '../../../constants/messages/success';

// Define the valid and invalid credentials for reusability and scalability
const VALID_CREDENTIALS = {
  name: 'Valid User',
  email: 'validEmail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Registration Process', () => {
  // User creation
  describe('User Creation', () => {
    it('should create a new user with valid credentials', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send(VALID_CREDENTIALS);

      const { statusCode, header, body } = response;

      expect(statusCode).toBe(STATUS_CODES.CREATED);

      const authorizationHeader = header['authorization'];
      expect(authorizationHeader).toMatch(/^Bearer .+$/);
      expect(authorizationHeader).toBeDefined();

      const setCookieHeader = response.get('set-cookie')[0];
      expect(setCookieHeader).toContain('refresh_token=');
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

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);

      const response = await request(app)
        .post(SIGN_IN_ROUTE)
        .send(VALID_CREDENTIALS);

      const { statusCode, header, body } = response;

      expect(statusCode).toBe(STATUS_CODES.OK);

      const authorizationHeader = header['authorization'];
      expect(authorizationHeader).toMatch(/^Bearer .+$/);
      expect(authorizationHeader).toBeDefined();

      const setCookieHeader = response.get('set-cookie')[0];
      expect(setCookieHeader).toContain('refresh_token=');
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

    // it('should respond with 200 when user disabled successfully', async () => {
    //   await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
    //   const response = await request(app)
    //     .post(SIGN_IN_ROUTE)
    //     .send(VALID_CREDENTIALS);
    //   expect(response.statusCode).toBe(STATUS_CODES.OK);
    //   expect(response.body.tokens).toHaveProperty('accessToken');
    //   expect(response.body.tokens).toHaveProperty('refreshToken');
    // });

    // it('should respond with 403 when account is disabled', async () => {
    //   await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
    //   const response = await request(app)
    //     .post(SIGN_IN_ROUTE)
    //     .send(VALID_CREDENTIALS);
    //   expect(response.statusCode).toBe(STATUS_CODES.FORBIDDEN);
    //   expect(response.body.message).toBe(ACCOUNT_DISABLED_ERROR);
    // });
  });
});
