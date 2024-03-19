import { hashPassword, comparePassword } from '../password.util';

describe('Password Utility', () => {
  it('should hash a password', async () => {
    const password = 'testPassword';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
    expect(hashedPassword.length).toBeGreaterThan(password.length);
  });

  it('should compare passwords correctly', async () => {
    const password = 'secretPassword';
    const hashedPassword = await hashPassword(password);
    const isMatch = await comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should not match incorrect passwords', async () => {
    const password = 'secretPassword';
    const hashedPassword = await hashPassword(password);
    const wrongPassword = 'incorrectPassword';
    const isMatch = await comparePassword(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });
});
