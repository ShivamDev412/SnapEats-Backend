// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Error";
import { MESSAGES } from "../utils/Constant";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.isOperational) {
    err = new AppError(MESSAGES.UNEXPECTED_ERROR, 500);
  }

  res.status(err.statusCode).json({
    success: err.success,
    message: err.message,
  });
};

export default errorHandler;
