import mongoose from "mongoose";

import { type AccessTokenPayload } from "@/api/v1/auth/auth.validation.js";
import { ErrorTypeEnum } from "@/constants";
import { extractTokenFromBearerString, generateAccessToken, generateRefreshToken } from "@/utils";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Jwt token", () => {
  const mockdata: AccessTokenPayload = {
    userId: new mongoose.Types.ObjectId(),
    permissions: [],
    tokenVersion: 0,
    deviceId: crypto.randomUUID(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should generate an access token", () => {
    const token = generateAccessToken(mockdata);
    expect(token).toBeDefined();
  });

  it("should generate a refresh token", () => {
    const token = generateRefreshToken({ sessionId: new mongoose.Types.ObjectId() });
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
