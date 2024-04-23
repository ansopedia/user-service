import { generateOTP } from '../otp.util';

describe('generateOTP', () => {
  it('should return a number', () => {
    const otp = generateOTP();
    expect(typeof otp).toBe('number');
  });

  it('should return a 6 digit number by default', () => {
    const otp = generateOTP();
    expect(otp).toBeGreaterThanOrEqual(100000);
    expect(otp).toBeLessThan(1000000);
  });

  it('should return a number of specified length', () => {
    const length = 4;
    const otp = generateOTP(length);
    expect(otp).toBeGreaterThanOrEqual(Math.pow(10, length - 1));
    expect(otp).toBeLessThan(Math.pow(10, length));
  });
});
