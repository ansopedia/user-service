import * as bcryptjs from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcryptjs.genSalt(saltRounds);
  return bcryptjs.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hashedPassword);
};
