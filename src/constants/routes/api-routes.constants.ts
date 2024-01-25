export const BASE_URL = '/api/v1';

// Authentication routes
export const SIGN_UP_ROUTE = `${BASE_URL}/auth/signup`;
export const SIGN_IN_ROUTE = `${BASE_URL}/auth/signin`;
export const LOGOUT_ROUTE = `${BASE_URL}/auth/logout`;
export const PASSWORD_RESET_ROUTE = `${BASE_URL}/auth/password-reset`;

// User routes
export const GET_PROFILE_ROUTE = `${BASE_URL}/users/profile`;
export const UPDATE_PROFILE_ROUTE = `${BASE_URL}/users/profile`;
export const GET_ALL_USERS_ROUTE = `${BASE_URL}/users`;
