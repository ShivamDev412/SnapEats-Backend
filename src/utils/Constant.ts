export const MESSAGES = {
  SERVER_RUNNING: (port: number | string) => `Server is running on port ${port}`,
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
  IMAGE_ERROR:"Something went wrong while retrieving image",
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
