import { type Username, usernameSchema } from "@ansospace/types";
import { type Request } from "express";

import { envConstants } from "@/constants";

export const getServerURL = (req: Request) => {
  return `${req.protocol}://${req.get("host")}`;
};

export const generateRandomUsername = (): Username => {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomString = Math.random().toString(36).substring(2, 10);
  return usernameSchema.parse(`user_${randomString}`);
};

export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === envConstants.CLIENT_URL;
  } catch {
    return false;
  }
};
