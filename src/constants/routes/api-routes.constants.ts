interface RouteGroup {
  [key: string]: string;
}

export const BASE_URL = '/api/v1';

export const AUTH_ROUTES: RouteGroup = {
  SIGN_UP: `${BASE_URL}/auth/signup`,
  SIGN_IN: `${BASE_URL}/auth/signin`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  PASSWORD_RESET: `${BASE_URL}/auth/password-reset`,
};

export const USER_ROUTES: RouteGroup = {
  GET_PROFILE: `${BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  GET_ALL_USERS: `${BASE_URL}/users`,
};
