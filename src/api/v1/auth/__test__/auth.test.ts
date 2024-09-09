import { sign } from 'jsonwebtoken';
import { envConstants, errorMap, ErrorTypeEnum, STATUS_CODES } from '@/constants';
import { expectSignUpSuccess, login, renewToken, signUp } from '@/utils/test';
import { Login, loginSchema } from '@/api/v1/auth/auth.validation';
import { ZodError, ZodIssue } from 'zod';

const VALID_CREDENTIALS = {
  username: 'validUser',
  email: 'validemail1@example.com',
  password: 'ValidPassword123@',
  confirmPassword: 'ValidPassword123@',
};

type ValidationResult = { success: true; data: Login } | { success: false; error: ZodIssue[] };
// Helper function to validate schema
const validateLoginSchema = (body: unknown): ValidationResult => {
  try {
    const data = loginSchema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.errors };
    }
    throw error;
  }
};

describe('Auth Test', () => {
  it('should respond with 404 when user not found', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NOT_FOUND];
    const response = await login({
      email: 'notRegistered@test.com',
      password: 'notRegistered123@',
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
      password: 'notRegistered123@',
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

  test('should accept valid email login', () => {
    const result = validateLoginSchema({ email: 'user@example.com', password: 'Password123@' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: 'user@example.com', password: 'Password123@' });
    }
  });

  test('should accept valid username login', () => {
    const result = validateLoginSchema({ username: 'user123', password: 'Password123@' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ username: 'user123', password: 'Password123@' });
    }
  });

  test('should reject invalid email format', () => {
    const result = validateLoginSchema({ email: 'invalid-email', password: 'Password123@' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error[0].message).toBe('Invalid email');
    }
  });

  test('should reject when both email and username are missing', () => {
    const result = validateLoginSchema({ password: 'Password123@' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error[0].message).toBe('Please provide either an email or a username');
    }
  });

  test('should reject when password is missing', () => {
    const result = validateLoginSchema({ email: 'user@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error[0].message).toBe('Required');
    }
  });

  test('should reject when email is empty string', () => {
    const result = validateLoginSchema({ email: '', password: 'Password123@' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error[0].message).toBe('Invalid email');
    }
  });

  test('should reject when username is empty string', () => {
    const result = validateLoginSchema({ username: '', password: 'Password123@' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error[0].message).toBe('username must be at least 3 characters');
    }
  });
});
