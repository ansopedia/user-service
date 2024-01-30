export const BASE_URL = '/api/v1';

// Authentication routes
export const SIGN_UP_ROUTE = `${BASE_URL}/auth/signup`;
export const SIGN_IN_ROUTE = `${BASE_URL}/auth/signin`;
export const LOGOUT_ROUTE = `${BASE_URL}/auth/logout`;
export const PASSWORD_RESET_ROUTE = `${BASE_URL}/auth/password-reset`;
export const VERIFY_ACCESS_TOKEN_ROUTE = `${BASE_URL}/auth/verify-access-token`;
export const REFRESH_TOKEN_ROUTE = `${BASE_URL}/auth/refresh-token`;

// User routes
export const GET_USER_ROUTE = `${BASE_URL}/user`;
export const UPDATE_USER_ROUTE = `${BASE_URL}/user`;
export const GET_ALL_USER_ROUTE = `${BASE_URL}/users`;
export const UPDATE_USER_STATUS_ROUTE = `${BASE_URL}/user/:userId/status`;
export const GET_USER_BY_USERNAME_ROUTE = `${BASE_URL}/user/:username`;
