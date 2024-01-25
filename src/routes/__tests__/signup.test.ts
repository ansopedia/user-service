import request from 'supertest';
import { app } from '../../server';
import {
  SIGN_UP_ROUTE,
  SIGN_IN_ROUTE,
  EMAIL_EMPTY_ERROR,
  PASSWORD_TOO_SHORT,
  EMAIL_INVALID_ERROR,
  PASSWORD_EMPTY_ERROR,
  PASSWORD_MISSING_NUMBER,
  PASSWORD_MISSING_UPPERCASE,
  PASSWORD_MISSING_LOWERCASE,
  EMAIL_ALREADY_EXISTS_ERROR,
  CONFIRM_PASSWORD_EMPTY_ERROR,
  PASSWORD_MISSING_CASE_VARIATION,
  CONFIRM_PASSWORD_MISMATCH_ERROR,
} from '../../constants';

// Define the valid and invalid credentials for reusability and scalability
const VALID_CREDENTIALS = {
  name: 'Valid User',
  email: 'validEmail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

const invalidEmailCredentials = {
  ...VALID_CREDENTIALS,
  email: 'invalidEmail',
};

const mismatchedPasswordCredentials = {
  ...VALID_CREDENTIALS,
  confirmPassword: 'MismatchedPassword123!',
};

const passwordTestCases = [
  {
    password: 'short',
    expectedMessage: PASSWORD_TOO_SHORT,
  },
  {
    password: 'Password',
    expectedMessage: PASSWORD_MISSING_NUMBER,
  },
  {
    password: '12345678',
    expectedMessage: PASSWORD_MISSING_CASE_VARIATION,
  },
  {
    password: 'PASSWORD123',
    expectedMessage: PASSWORD_MISSING_LOWERCASE,
  },
  {
    password: 'password123',
    expectedMessage: PASSWORD_MISSING_UPPERCASE,
  },
];

describe('User Registration Process', () => {
  // Test for email validation
  describe('Email Validation', () => {
    it('should respond with a 422 status code when an invalid email is provided', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send(invalidEmailCredentials);
      expect(response.statusCode).toBe(422);
      const error = response.body.errors[0];
      expect(error.msg).toBe(EMAIL_INVALID_ERROR);
    });

    it('should respond with 422 for empty email', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send({ ...VALID_CREDENTIALS, email: '' });
      expect(response.statusCode).toBe(422);
      const error = response.body.errors[0];
      expect(error.msg).toBe(EMAIL_EMPTY_ERROR);
    });
  });

  // Test for password validation
  describe('Password Validation', () => {
    passwordTestCases.forEach(({ password, expectedMessage }) => {
      it(`should respond with a 422 status code and appropriate message when the password "${password}" does not meet the strength requirements`, async () => {
        const response = await request(app)
          .post(SIGN_UP_ROUTE)
          .send({ ...VALID_CREDENTIALS, password, confirmPassword: password });
        expect(response.statusCode).toBe(422);
        const error = response.body.errors[0];
        expect(error.msg).toBe(expectedMessage);
      });
    });

    // it.each(['password', '123456', 'qwerty'])('should not allow common password "%s"', async (commonPassword) => {
    //   const response = await request(app)
    //     .post(SIGN_UP_ROUTE)
    //     .send({ ...VALID_CREDENTIALS, password: commonPassword, confirmPassword: commonPassword });
    //   expect(response.statusCode).toBe(422);
    //   expect(response.body.message).toBe('Password is too common');
    // });

    // it.each(['ValidUser123!', 'User123Valid', '123ValidUser'])(
    //   'should not allow passwords containing user information "%s"',
    //   async (userPassword) => {
    //     const response = await request(app)
    //       .post(SIGN_UP_ROUTE)
    //       .send({ ...VALID_CREDENTIALS, password: userPassword, confirmPassword: userPassword });
    //     expect(response.statusCode).toBe(422);

    //     expect(response.body.message).toBe('Password cannot contain user information');
    //   },
    // );

    it('should respond with 422 for empty password', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send({ ...VALID_CREDENTIALS, password: '', confirmPassword: '' });
      expect(response.statusCode).toBe(422);
      const error = response.body.errors[0];
      expect(error.msg).toBe(PASSWORD_EMPTY_ERROR);
    });
  });

  // Test for password confirmation
  describe('Password Confirmation', () => {
    it('should respond with a 422 status code when the confirmPassword does not match the password', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send(mismatchedPasswordCredentials);
      expect(response.statusCode).toBe(422);
      const error = response.body.errors[0];
      expect(error.msg).toBe(CONFIRM_PASSWORD_MISMATCH_ERROR);
    });

    it('should respond with 422 for empty confirm password', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send({ ...VALID_CREDENTIALS, confirmPassword: '' });
      expect(response.statusCode).toBe(422);
      const error = response.body.errors[0];
      expect(error.msg).toBe(CONFIRM_PASSWORD_EMPTY_ERROR);
    });
  });

  // User creation
  describe('User Creation', () => {
    it('should create a new user with valid credentials', async () => {
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(201);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    it('should respond with 422 for duplicate email', async () => {
      await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
      const response = await request(app)
        .post(SIGN_UP_ROUTE)
        .send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(EMAIL_ALREADY_EXISTS_ERROR);
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      await request(app).post(SIGN_UP_ROUTE).send(VALID_CREDENTIALS);
      const response = await request(app)
        .post(SIGN_IN_ROUTE)
        .send(VALID_CREDENTIALS);
      expect(response.statusCode).toBe(200);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });
  });
});
