import type { Password } from "@ansospace/types";
import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<Password> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return (await bcrypt.hash(password, salt)) as Password;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
