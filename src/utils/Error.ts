import { MESSAGES, STATUS_CODE } from "./Constant";

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = MESSAGES.NOT_FOUND) {
    super(message, STATUS_CODE.NOT_FOUND);
  }
}

class ValidationError extends AppError {
  constructor(message = MESSAGES.VALIDATION_ERROR) {
    super(message, STATUS_CODE.BAD_REQUEST);
  }
}

class AuthError extends AppError {
  constructor(message = MESSAGES.AUTHENTICATION_ERROR) {
    super(message, STATUS_CODE.UNAUTHORIZED);
  }
}
class ForbiddenError extends AppError {
  constructor(message = MESSAGES.FORBIDDEN) {
    super(message, STATUS_CODE.FORBIDDEN);
  }
}
class InternalServerError extends AppError {
  constructor(message = MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
export {
  AppError,
  NotFoundError,
  ValidationError,
  AuthError,
  ForbiddenError,
  InternalServerError,
};
