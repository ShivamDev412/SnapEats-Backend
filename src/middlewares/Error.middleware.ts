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
    console.error("Unexpected Error:", err);
    err = new AppError(MESSAGES.UNEXPECTED_ERROR, 500);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
