const BASE_PATH = "/api/v1";
const RESOURCE_PATH = {
  AUTH: "/auth",
  USER: "/user",
};
const ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  LOGOUT: "/logout",
  REFRESH_TOKEN: "/refresh-token",
  // User
  BASE:"/",
  UPDATE_PROFILE: "/update-profile",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

export { ENDPOINTS, BASE_PATH, RESOURCE_PATH };
