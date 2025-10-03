import { emailSchema, mongooseObjectId, usernameSchema } from "@ansospace/types";
import mongoose from "mongoose";
import { describe, expect, it } from "vitest";

// import { validateEmail, validateObjectId, validateUsername } from "@/utils";

describe("validation.util", () => {
  describe("validateObjectId", () => {
    it("should validate a valid ObjectId string", () => {
      const validObjectId = new mongoose.Types.ObjectId().toHexString();
      const result = mongooseObjectId.parse(validObjectId);
      expect(result).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(result.toHexString()).toBe(validObjectId);
    });

    it("should throw an error for an invalid ObjectId string", () => {
      expect(() => mongooseObjectId.parse("invalid-object-id")).toThrow();
      expect(() => mongooseObjectId.parse(123)).toThrow();
      expect(() => mongooseObjectId.parse(null)).toThrow();
      expect(() => mongooseObjectId.parse(undefined)).toThrow();
    });
  });

  describe("validateUsername", () => {
    it("should validate a valid username", () => {
      const validUsername = "valid_user123";
      const result = usernameSchema.parse(validUsername);
      expect(result).toBe(validUsername.toLowerCase());
    });

    it("should throw an error for invalid usernames", () => {
      const invalidUsernames = [
        "ab", // too short
        "thisusernameiswaytoolongtobevalid", // too long
        "1startswithnumber", // starts with number
        "invalid space", // contains space
        "invalid*char", // contains invalid character
        "", // empty string
        null,
        undefined,
      ];
      invalidUsernames.forEach((username) => {
        expect(() => usernameSchema.parse(username)).toThrow();
      });
    });
  });

  describe("validateEmail", () => {
    it("should validate a valid email", () => {
      const validEmail = "Test.Email@example.com";
      const result = emailSchema.parse(validEmail);
      expect(result).toBe(validEmail.toLowerCase());
    });

    it("should throw an error for invalid emails", () => {
      const invalidEmails = [
        "plainaddress",
        "@missingusername.com",
        "missingatsign.com",
        "missingdomain@.com",
        "missingdot@domaincom",
        "",
      ];
      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });
});
