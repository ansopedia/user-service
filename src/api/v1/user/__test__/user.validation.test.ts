import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  username,
  userSchema,
  validateCreateUser,
  validateEmail,
  validateUsername,
} from '../user.validation';

describe('User Validation', () => {
  describe('Username validation', () => {
    it('should pass when the username is valid', () => {
      const result = validateCreateUser({
        username: 'validUsername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when the username is less than 3 characters', () => {
      const result = validateCreateUser({
        username: 'ab',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('username must be at least 3 characters');
    });

    it('should fail when the username is more than 18 characters', () => {
      const result = validateCreateUser({
        username: 'thisisaverylongusername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('username must be at most 18 characters');
    });

    it('should fail when the username does not start with a letter', () => {
      const result = validateCreateUser({
        username: '1invalidusername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('username must start with a letter');
    });

    it('should fail when the username contains invalid characters', () => {
      const result = validateCreateUser({
        username: 'invalid_username!',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'username can only contain alphanumeric characters, hyphens, and underscores',
      );
    });
  });

  describe('Password validation', () => {
    it('should pass when the password is valid', () => {
      const result = validateCreateUser({
        username: 'validUsername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when the password is less than 8 characters', () => {
      const result = validateCreateUser({
        username: 'validUsername',
        email: 'testuser@example.com',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Password must be at least 8 characters long');
    });

    it('should fail when passwords do not match', () => {
      const result = validateCreateUser({
        username: 'validUsername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'password321',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Confirm password does not match password');
    });
  });
});

describe('User Schema Validation', () => {
  describe('username', () => {
    it('should pass for valid usernames', () => {
      expect(username.parse('john123')).toBe('john123');
      expect(username.parse('Alice')).toBe('alice');
    });

    it('should fail for usernames shorter than 3 characters', () => {
      expect(() => username.parse('ab')).toThrow('username must be at least 3 characters');
    });

    it('should fail for usernames longer than 18 characters', () => {
      expect(() => username.parse('thisusernameistoolong')).toThrow('username must be at most 18 characters');
    });

    it('should fail for usernames not starting with a letter', () => {
      expect(() => username.parse('123user')).toThrow('username must start with a letter');
    });

    it('should fail for usernames with non-alphanumeric characters', () => {
      expect(() => username.parse('user@name')).toThrow('username can only contain alphanumeric characters');
    });
  });

  describe('userSchema', () => {
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123@',
      confirmPassword: 'Password123@',
      isEmailVerified: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should pass for a valid user object', () => {
      expect(() => userSchema.parse(validUser)).not.toThrow();
    });

    it('should fail for invalid email', () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      expect(() => userSchema.parse(invalidUser)).toThrow();
    });
  });

  describe('createUserSchema', () => {
    it('should pass for valid email/password user creation', () => {
      const validUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      };
      expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should pass for valid Google user creation', () => {
      const validGoogleUser = {
        username: 'googleuser',
        email: 'google@example.com',
        googleId: '12345',
        isEmailVerified: true,
      };
      expect(() => createUserSchema.parse(validGoogleUser)).not.toThrow();
    });

    it('should fail when passwords do not match', () => {
      const result = validateCreateUser({
        username: 'validUsername',
        email: 'testuser@example.com',
        password: 'Password123@',
        confirmPassword: 'password321',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Confirm password does not match password');
    });
  });

  describe('validateUsername', () => {
    it('should pass for valid username', () => {
      expect(() => validateUsername.parse({ username: 'validuser' })).not.toThrow();
    });

    it('should fail for invalid username', () => {
      expect(() => validateUsername.parse({ username: 'a' })).toThrow();
    });
  });

  describe('validateEmail', () => {
    it('should pass for valid email', () => {
      expect(validateEmail.parse('test@example.com')).toBe('test@example.com');
    });

    it('should fail for invalid email', () => {
      expect(() => validateEmail.parse('invalid-email')).toThrow();
    });
  });

  describe('updateUserSchema', () => {
    it('should pass for valid partial update', () => {
      expect(() => updateUserSchema.parse({ username: 'updateduser' })).not.toThrow();
    });

    it('should fail for empty update', () => {
      expect(() => updateUserSchema.parse({})).toThrow('At least one field is required for user update');
    });
  });

  describe('getUserSchema', () => {
    it('should not include password and confirmPassword fields', () => {
      const user = getUserSchema.parse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        email: 'test@example.com',
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('confirmPassword');
    });
  });

  describe('validateCreateUser', () => {
    it('should return success for valid user creation data', () => {
      const validUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'Password123@',
        confirmPassword: 'Password123@',
      };
      const result = validateCreateUser(validUser);
      expect(result.success).toBe(true);
    });

    it('should return error for invalid user creation data', () => {
      const invalidUser = {
        username: 'nu',
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'nomatch',
      };
      const result = validateCreateUser(invalidUser);
      expect(result.success).toBe(false);
    });
  });
});
