import { envConstants } from "../constants/env.constant.js";

export const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  // eslint-disable-next-line sonarjs/no-clear-text-protocols -- http is acceptable for localhost development
  "http://localhost:*",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  // eslint-disable-next-line sonarjs/no-clear-text-protocols -- http is acceptable for local network development
  "http://192.168.1.70:5173",
  // eslint-disable-next-line sonarjs/no-clear-text-protocols -- http is acceptable for local network development
  "http://192.168.1.70:3000",
  envConstants.CLIENT_URL,
  envConstants.USER_SERVICE_BASE_URL,
];
