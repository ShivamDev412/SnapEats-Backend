// src/utils/errors.ts

import { MESSAGES, STATUS_CODE } from "./Constant";

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

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

export { AppError, NotFoundError, ValidationError, AuthError };
