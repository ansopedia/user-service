import { ZodError } from "zod";
import { password } from "../user.validation";

describe("Password Schema", () => {
  const validatePassword = (pwd: string) => {
    try {
      password.parse(pwd);
      return { success: true };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.errors[0].message };
      }
      throw error;
    }
  };

  test("accepts a valid password", () => {
    const result = validatePassword("StrongP@ssw0rd");
    expect(result.success).toBe(true);
  });

  test("rejects password shorter than 8 characters", () => {
    const result = validatePassword("Short@1");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password must be at least 8 characters long");
  });

  test("rejects password without uppercase letter", () => {
    const result = validatePassword("nouppercasehere@1");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password must contain at least one uppercase letter");
  });

  test("rejects password without lowercase letter", () => {
    const result = validatePassword("NOLOWERCASEHERE@1");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password must contain at least one lowercase letter");
  });

  test("rejects password without numeric digit", () => {
    const result = validatePassword("NoNumbersHere@");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password must contain at least one numeric digit");
  });

  test("rejects password without special character", () => {
    const result = validatePassword("NoSpecialChars123");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password must contain at least one special character");
  });

  test("rejects password with repeated characters", () => {
    const result = validatePassword("AAAbbbCcc@123");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Password should not contain repeated characters");
  });

  test("accepts password with various special characters", () => {
    const result = validatePassword("Str0ng#P@ssw0rd!");
    expect(result.success).toBe(true);
  });

  test("accepts password with exactly 12 characters", () => {
    const result = validatePassword("StrongP@ss12");
    expect(result.success).toBe(true);
  });
});
