interface RouteGroup {
  [key: string]: string;
}

export const BASE_URL = '/api/v1';

export const AUTH_ROUTES: RouteGroup = {
  SIGN_UP: `${BASE_URL}/auth/signup`,
};
