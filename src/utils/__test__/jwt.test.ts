import { JwtAccessToken } from "@/api/v1/auth/auth.validation";
import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString, generateAccessToken, generateRefreshToken } from "@/utils";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Jwt token", () => {
  const mockPayload: JwtAccessToken = {
    userId: "123",
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should generate an access token", () => {
    const token = generateAccessToken(mockPayload);
    expect(token).toBeDefined();
  });

  it("should generate a refresh token", () => {
    const token = generateRefreshToken({ id: "123" });
    expect(token).toBeDefined();
  });

  it("should check a bearer token", () => {
    const mockToken = "mockToken";
    const result = extractTokenFromBearerString(`Bearer ${mockToken}`);
    expect(result).toEqual(mockToken);
  });
});

describe("extractTokenFromBearerString", () => {
  it("should extract token from valid bearer string", () => {
    const bearerToken = "Bearer abc123";
    expect(extractTokenFromBearerString(bearerToken)).toBe("abc123");
  });

  it("should throw INVALID_ACCESS error for non-Bearer prefix", () => {
    const invalidBearerToken = "NotBearer abc123";
    expect(() => extractTokenFromBearerString(invalidBearerToken)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });

  it("should throw INVALID_ACCESS error for missing token", () => {
    const invalidBearerToken = "Bearer ";
    expect(() => extractTokenFromBearerString(invalidBearerToken)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });

  it("should throw INVALID_ACCESS error for empty string", () => {
    const emptyString = "";
    expect(() => extractTokenFromBearerString(emptyString)).toThrow(ErrorTypeEnum.enum.INVALID_ACCESS);
  });
});
