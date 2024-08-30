import jwt from 'jsonwebtoken';
import { JwtAccessToken } from '@/api/v1/auth/auth.validation';
import { extractTokenFromBearerString, generateAccessToken, generateRefreshToken, verifyToken } from '@/utils';
import { envConstants, ErrorTypeEnum } from '@/constants';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Jwt token', () => {
  const mockPayload: JwtAccessToken = {
    userId: '123',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should generate an access token', () => {
    generateAccessToken(mockPayload);
    expect(jwt.sign).toHaveBeenCalledWith(mockPayload, envConstants.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  });

  it('should generate a refresh token', () => {
    generateRefreshToken({ id: '123' });
    expect(jwt.sign).toHaveBeenCalledWith({ id: '123' }, envConstants.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  });

  it('should verify access token', async () => {
    const mockToken = 'mockToken';
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
    const result = await verifyToken(mockToken, 'access');
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, envConstants.JWT_ACCESS_SECRET);
    expect(result).toEqual(mockPayload);
  });

  it('should check a bearer token', () => {
    const mockToken = 'mockToken';
    const result = extractTokenFromBearerString(`Bearer ${mockToken}`);
    expect(result).toEqual(mockToken);
  });
});

describe('extractTokenFromBearerString', () => {
  it('should extract token from valid bearer string', () => {
    const bearerToken = 'Bearer abc123';
    expect(extractTokenFromBearerString(bearerToken)).toBe('abc123');
  });

  it('should throw INVALID_ACCESS error for non-Bearer prefix', () => {
    const invalidBearerToken = 'NotBearer abc123';
    expect(() => extractTokenFromBearerString(invalidBearerToken)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });

  it('should throw INVALID_ACCESS error for missing token', () => {
    const invalidBearerToken = 'Bearer ';
    expect(() => extractTokenFromBearerString(invalidBearerToken)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });

  it('should throw INVALID_ACCESS error for empty string', () => {
    const emptyString = '';
    expect(() => extractTokenFromBearerString(emptyString)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });
});
