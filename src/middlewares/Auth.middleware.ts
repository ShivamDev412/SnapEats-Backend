import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../utils/Constant";
import { AuthError, ForbiddenError } from "../utils/Error";

export type AuthPayload = {
  id: string;
  email: string;
  storeId?: string;
};
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      file?: Express.Multer.File;
    }
  }
}


export const AuthMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader =
    request.headers.authorization || request.headers.Authorization;
  if (!authHeader?.includes("Bearer ")) {
    return new AuthError(MESSAGES.INVALID_AUTH_HEADER);
  }
  const token = authHeader?.toString().split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err, decode) => {
    if (err) {
      next(new ForbiddenError(MESSAGES.TOKEN_EXPIRED));
    } else {
      request.user = decode as AuthPayload;
      next();
    }
  });
};
