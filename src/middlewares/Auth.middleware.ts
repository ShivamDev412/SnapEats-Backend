import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../utils/Constant";
import { AuthError, ForbiddenError } from "../utils/Error";
import prisma from "../dbConfig";

export type AuthPayload = {
  id: string;
  email?: string;
  storeId?: string;
};

declare global {
  namespace Express {
    export interface User extends AuthPayload {}
    interface Request {
      user?: User;
      file?: Express.Multer.File;
      twoFAToken?: string;
    }
  }
}

export const AuthMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader =
    request.headers.authorization || request.headers.Authorization;
  if (!authHeader?.includes("Bearer ")) {
    return next(new AuthError(MESSAGES.INVALID_AUTH_HEADER));
  }

  const token = authHeader?.toString().split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
    if (err) {
      return next(new ForbiddenError(MESSAGES.TOKEN_EXPIRED));
    } else {
      request.user = decoded as AuthPayload;
      next();
    }
  });
};
