import { username, password, validateCreateUser } from '../user.validation';

describe('Username validation', () => {
  it('should accept valid usernames', () => {
    expect(username.parse('john123')).toBe('john123');
    expect(username.parse('Alice')).toBe('alice');
    expect(username.parse('John-Doe')).toBe('john-doe');
    expect(username.parse('Alice_123')).toBe('alice_123');
  });

  it('should reject usernames that are shorter than 3 characters', () => {
    expect(() => username.parse('ab')).toThrow('username must be at least 3 characters');
  });

  it('should reject usernames that are too longer than 18 characters', () => {
    expect(() => username.parse('thisisaverylongusername')).toThrow('username must be at most 18 characters');
  });

  it('should reject usernames that do not start with a letter', () => {
    expect(() => username.parse('123user')).toThrow('username must start with a letter');
  });

  it('should reject usernames with non-alphanumeric characters', () => {
    expect(() => username.parse('user@name')).toThrow(
      'username can only contain alphanumeric characters, hyphens, and underscores',
    );
  });

  it('should transform usernames to lowercase', () => {
    expect(username.parse('JohnDoe')).toBe('johndoe');
  });
});

describe('Password validation', () => {
  it('should accept valid passwords', () => {
    expect(password.parse('P@ssw0rd')).toBe('P@ssw0rd');
    expect(password.parse('Str0ng!Pass')).toBe('Str0ng!Pass');
  });

  it('should reject passwords that are less than 8 characters', () => {
    expect(() => password.parse('Short1!')).toThrow('Password must be at least 8 characters long');
  });

  it('should reject passwords without uppercase letters', () => {
    expect(() => password.parse('password1!')).toThrow('Password must contain at least one uppercase letter');
  });

  it('should reject passwords without lowercase letters', () => {
    expect(() => password.parse('PASSWORD1!')).toThrow('Password must contain at least one lowercase letter');
  });

  it('should reject passwords without numeric digits', () => {
    expect(() => password.parse('Password!')).toThrow('Password must contain at least one numeric digit');
  });

  it('should reject passwords without special characters', () => {
    expect(() => password.parse('Password1')).toThrow('Password must contain at least one special character');
  });

  it('should reject passwords with repeated characters', () => {
    expect(() => password.parse('Passwooord1!')).toThrow('Password should not contain repeated characters');
  });
});

describe('Create user schema validation', () => {
  it('should accept valid user data with email and password', () => {
    const validUser = {
      email: 'user@example.com',
      username: 'validuser',
      password: 'V@lidPass1',
      confirmPassword: 'V@lidPass1',
    };
    expect(() => validateCreateUser(validUser)).not.toThrow();
  });

  it('should accept valid user data with Google ID', () => {
    const validGoogleUser = {
      email: 'user@example.com',
      username: 'validuser',
      isEmailVerified: true,
      googleId: '123456789',
    };
    expect(() => validateCreateUser(validGoogleUser)).not.toThrow();
  });

  it('should reject user data with mismatched passwords', () => {
    const invalidUser = {
      email: 'user@example.com',
      username: 'validuser',
      password: 'V@lidPass1',
      confirmPassword: 'DifferentPass1!',
    };
    expect(() => validateCreateUser(invalidUser)).toThrow('Confirm password does not match password');
  });

  it('should reject user data with invalid email', () => {
    const invalidUser = {
      email: 'invalid-email',
      username: 'validuser',
      password: 'V@lidPass1',
      confirmPassword: 'V@lidPass1',
    };
    expect(() => validateCreateUser(invalidUser)).toThrow('Invalid email');
  });

  it('should reject user data with invalid username', () => {
    const invalidUser = {
      email: 'user@example.com',
      username: 'in',
      password: 'V@lidPass1',
      confirmPassword: 'V@lidPass1',
    };
    expect(() => validateCreateUser(invalidUser)).toThrow('username must be at least 3 characters');
  });
});
