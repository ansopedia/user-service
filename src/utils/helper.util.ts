import { type Request } from "express";

import { envConstants } from "@/constants";

export const getServerURL = (req: Request) => {
  return `${req.protocol}://${req.get("host")}`;
};

export const generateRandomUsername = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user_${randomString}`;
};

export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === envConstants.CLIENT_URL;
  } catch {
    return false;
  }
};
