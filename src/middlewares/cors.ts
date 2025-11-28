import { envConstants } from "../constants/env.constant.js";

export const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  "http://localhost:*",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://192.168.1.70:5173",
  "http://192.168.1.70:3000",
  "https://*.ansopedia.com",
  envConstants.CLIENT_URL,
  envConstants.USER_SERVICE_BASE_URL,
];
