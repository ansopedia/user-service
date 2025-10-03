import { emailSchema, passwordSchema, usernameSchema } from "@ansospace/types";

export const mockUser = {
  username: usernameSchema.parse("username"),
  email: emailSchema.parse("validemail@example.com"),
  password: passwordSchema.parse("ValidPassword123!"),
  confirmPassword: passwordSchema.parse("ValidPassword123!"),
};
