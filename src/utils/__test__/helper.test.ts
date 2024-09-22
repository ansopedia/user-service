import { validateUsername } from "@/api/v1/user/user.validation";
import { generateRandomUsername } from "@/utils";

describe("generateRandomUsername", () => {
  it('should generate a username that starts with "user_"', () => {
    const randomUsername = generateRandomUsername();
    expect(randomUsername).toMatch(/^user_/);
  });

  it('should generate a username with an alphanumeric string of length 8 after "user_"', () => {
    const randomUsername = generateRandomUsername();
    const suffix = randomUsername.substring(5); // Remove "user_"
    expect(suffix).toHaveLength(8);
    expect(suffix).toMatch(/^[a-z0-9]+$/i);
  });

  it("should generate a valid username that validates against the username schema", () => {
    const username = generateRandomUsername();
    const result = validateUsername.safeParse({ username });
    expect(result.success).toBe(true);
  });
});
