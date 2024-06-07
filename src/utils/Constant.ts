export const MESSAGES = {
  SERVER_RUNNING: (port: number | string) =>
    `Server is running on port ${port}`,
  LOGIN_SUCCESS: "Login successful",
  SIGNUP_SUCCESS: "Signup successful",
  USER_NOT_FOUND: "User with this email does not exist",
  USER_BY_ID_NOT_FOUND: "User with this id does not exist",
  INVALID_PASSWORD: "Invalid password",
  NOT_FOUND: "Not Found",
  VALIDATION_ERROR: "Validation Error",
  AUTHENTICATION_ERROR: "Authentication Error",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Invalid authorization token",
  USER_ALREADY_EXISTS: "User already exists with this email",
  INVALID_AUTH_HEADER: "Invalid authorization header",
  IMAGE_ERROR: "Something went wrong while retrieving image",
  USER_PROFILE_UPDATED: "User profile updated successfully",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  NOT_USER_WITH_THIS_REFRESH_TOKEN: "No user found with this refresh token",
  PASSWORD_RESET_LINK_SENT: "Password reset link sent successfully",
  RESET_PASSWORD_SUBJECT: "Reset Password",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  ACCESS_TOKEN_GENERATED: "Access token generated successfully",
  REFRESH_TOKEN_NOT_FOUND: "Refresh Token not found",
  LOGGED_OUT: "Logged out successfully",
  ADDRESS_CREATED: "Address created successfully",
  ADDRESS_UPDATED: "Address updated successfully",
  ADDRESS_DELETED: "Address deleted successfully",
  ADDRESS_MARKED_AS_DEFAULT: "Address marked as default successfully",
  PHONE_NUMBER_UPDATED: "Phone number updated successfully",
  OTP_SENT: "OTP sent successfully",
  PHONE_NUMBER_VERIFIED: "Phone number verified successfully",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP expired",
  OTP_RESENT: "OTP resent successfully",
  EMAIL_VERIFIED: "Email verified successfully",
  PHONE_NUMBER_ALREADY_EXISTS: "This phone number is already registered with another account",
  STORE_WITH_EMAIL_EXISTS: "Store with this email already exists",
  STORE_WITH_PHONE_NUMBER_EXISTS: "Store with this phone number already exists",
  STORE_REQUEST_SEND_SUCCESS: "Store request sent successfully",
  STORE_FETCH_SUCCESS: "Store fetched successfully",
  STORE_REQUEST_FETCH_SUCCESS: "Store request fetched successfully",
  STORE_REQUEST_ACCEPTED: "Store registration request accepted",
  STORE_REQUEST_REJECTED: "Store registration request rejected",
};
export const VALIDATION_MESSAGES = {
  INVALID_EMAIL: "Invalid email address",
  FIRST_NAME_REQUIRED: "First name is required",
  INVALID_FIRST_NAME: "First name should be a string",
  LAST_NAME_REQUIRED: "Last name is required",
  INVALID_LAST_NAME: "Last name should be a string",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_PASSWORD:
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  PROFILE_PICTURE_REQUIRED: "Profile picture is required",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  PASSWORDS_DO_NOT_MATCH: "Password and confirm password do not match",
  TOKEN_REQUIRED: "Token is required",
  
};
export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
export const SOCKET_EVENT = {
  NEW_STORE_REQUEST: "new_store_requests",
  DISCONNECT: "disconnect",
  CONNECTION: "connection",
}
export const ADMIN_REFRESH_COOKIE = "snapEats-admin-refresh-token";
export const REFRESH_COOKIE = "snapEats-refresh-token";
export const SALT_ROUNDS = 10;
export const EMAIL_SUBJECT = {
  STORE_REGISTRATION_REJECTION: "Store Registration Rejected",
  STORE_REGISTRATION_SUCCESS: "Store Registration Successful",
}