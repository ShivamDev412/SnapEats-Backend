const BASE_PATH = "/api/v1";
const RESOURCE_PATH = {
  AUTH: "/auth",
  USER: "/user",
  STORE: "/store",
  ADMIN_AUTH: "/admin/auth",
  ADMIN: "/admin",
};
const ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  LOGOUT: "/logout",
  REFRESH_TOKEN: "/refresh-token",
  // User
  BASE: "/",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ADDRESS: "/address",
  MARK_ADDRESS_AS_DEFAULT: "/address/default",
  UPDATE_PHONE_NUMBER: "/update-phone-number",
  SEND_OTP: "/send-phoneNumber-otp",
  VERIFY_OTP: "/verify-phoneNumber-otp",
  RESEND_OTP: "/resend-phoneNumber-otp",
  SEND_EMAIL_OTP: "/send-email-otp",
  VERIFY_EMAIL_OTP: "/verify-email-otp",
  RESEND_EMAIL_OTP: "/resend-email-otp",
  CATEGORIES: "/categories",
  REGISTER_STORE: "/register",
  USER: "/user",
  OPTIONS: "/options",
  CHOICE: "/choice",
  MENU: "/menu",
  PROFILE: "/profile",
  CHANGE_LANGUAGE:"/change-language",
  CHANGE_PASSWORD:"/change-password",
  FOOD_TYPE: "/food-type",
  STORE_FOOD_TYPE: "/store-food-type",
  GOOGLE_AUTH_CALLBACK: "/google/callback",
  GITHUB_AUTH_CALLBACK: "/github/callback",
  // Admin
  GET_STORE_REQUESTS: "/store-registration-request",
  ACCEPT_STORE_REQUEST: "/accept-store-request",
  REJECT_STORE_REQUEST: "/reject-store-request",
};

export { ENDPOINTS, BASE_PATH, RESOURCE_PATH };
