import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import AuthService from "../services/Auth.service";
import { clearCookie, setCookies } from "../utils/HandleCookies";
import { updateUser } from "../dbConfig/queries/User.query";
import { MESSAGES, STATUS_CODE, VALIDATION_MESSAGES } from "../utils/Constant";
import { LoginSchema, SignupSchema } from "../Schemas/UserAuth.schema";
import { NotFoundError } from "../utils/Error";
type AuthServiceType = {
  loginUser: (
    email: string,
    password: string
  ) => Promise<{ token: string; refreshToken: string; user: User }>;
  signupUser: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    file: Express.Multer.File
  ) => Promise<{ token: string; refreshToken: string }>;
};
// 
class AuthController {
  authService: AuthServiceType;
  constructor() {
    this.authService = new AuthService();
  }
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - email
   *         - password
   *         - firstName
   *         - lastName
   *       properties:
   *         id:
   *           type: string
   *           description: The auto-generated id of the user
   *         email:
   *           type: string
   *           description: The user's email
   *         firstName:
   *           type: string
   *           description: The user's first name
   *         lastName:
   *           type: string
   *           description: The user's last name
   *         profilePicture:
   *           type: string
   *           description: The URL of the user's profile picture
   *       example:
   *         id: d5fE_asz
   *         email: user@example.com
   *         firstName: John
   *         lastName: Doe
   *         profilePicture: http://example.com/profile.jpg
   *
   * tags:
   *   name: Auth
   *   description: The authentication managing API
   *
   * /auth/signup:
   *   post:
   *     summary: Signs up a new user
   *     tags: [Auth]
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *               - profilePicture
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               profilePicture:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: The user was successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request
   */

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = SignupSchema.parse(
        req.body
      );
      const file = req.file;
      if (!file) {
        throw new NotFoundError(VALIDATION_MESSAGES.PROFILE_PICTURE_REQUIRED);
      }
      const { token, refreshToken } = await this.authService.signupUser(
        firstName,
        lastName,
        email,
        password,
        file
      );
      setCookies(res, "snapEats-refresh-token", refreshToken);
      res
        .status(STATUS_CODE.OK)
        .json({ message: MESSAGES.SIGNUP_SUCCESS, "auth-token": token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: error.errors });
      }
      next(error);
    }
  };

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Logs in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 description: The user's email
   *               password:
   *                 type: string
   *                 description: The user's password
   *             example:
   *               email: user@example.com
   *               password: Password123!
   *     responses:
   *       200:
   *         description: The user was successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Login successful
   *                 auth-token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   *       400:
   *         description: Bad request
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const cookies = req.cookies;
      const { user, token, refreshToken } = await this.authService.loginUser(
        email,
        password
      );
      // Filter out old refresh tokens
      const newRefreshTokenArray = cookies["snapEats-refresh-token"]
        ? user.refreshTokens.filter(
            (rt: string) => rt !== cookies["snapEats-refresh-token"]
          )
        : user.refreshTokens;
      // Clear the old refresh token if it exists
      if (cookies["snapEats-refresh-token"]) {
        clearCookie(res, "snapEats-refresh-token");
      }
      await updateUser(user.id, {
        refreshTokens: [...newRefreshTokenArray, refreshToken],
      });
      setCookies(res, "snapEats-refresh-token", refreshToken);
      res
        .status(STATUS_CODE.OK)
        .json({ message: MESSAGES.LOGIN_SUCCESS, "auth-token": token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: error.errors });
      }
      next(error);
    }
  };
}
export default AuthController;
