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
  BASE: "/",
  UPDATE_PROFILE: "/update-profile",
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
};

export { ENDPOINTS, BASE_PATH, RESOURCE_PATH };
