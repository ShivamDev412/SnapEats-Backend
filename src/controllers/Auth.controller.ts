import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import AuthService from "../services/Auth.service";
import { clearCookie, setCookies } from "../utils/HandleCookies";
import { updateUser } from "../dbConfig/queries/User.query";
import {
  MESSAGES,
  REFRESH_COOKIE,
  STATUS_CODE,
} from "../utils/Constant";
import { LoginSchema, SignupSchema } from "../Schemas/UserAuth.schema";
import { AuthError, InternalServerError, NotFoundError } from "../utils/Error";

//
class AuthController {
  authService: AuthService;
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
   *       example:
   *         id: d5fE_asz
   *         email: user@example.com
   *         firstName: John
   *         lastName: Doe
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
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
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
      const { token, refreshToken } = await this.authService.signupUser(
        firstName,
        lastName,
        email,
        password
      );
      setCookies(res, REFRESH_COOKIE, refreshToken);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.SIGNUP_SUCCESS,
        "auth-token": token,
        success: true,
      });
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
      const newRefreshTokenArray = cookies[REFRESH_COOKIE]
        ? user.refreshTokens.filter(
            (rt: string) => rt !== cookies[REFRESH_COOKIE]
          )
        : user.refreshTokens;
      // Clear the old refresh token if it exists
      if (cookies[REFRESH_COOKIE]) {
        clearCookie(res, REFRESH_COOKIE);
      }
      await updateUser(user.id, {
        refreshTokens: [...newRefreshTokenArray, refreshToken],
      });
      setCookies(res, REFRESH_COOKIE, refreshToken);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.LOGIN_SUCCESS,
        success: true,
        "auth-token": token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: error.errors });
      }
      next(error);
    }
  };
  refreshToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const cookies = request.cookies;
      const refreshToken = cookies[REFRESH_COOKIE];
      if (!refreshToken) {
        return new AuthError(MESSAGES.INVALID_REFRESH_TOKEN);
      }
      const { accessTokenToSend, refreshTokenToSend } =
        await this.authService.refreshToken(refreshToken);
      if (accessTokenToSend && refreshTokenToSend) {
        setCookies(response, REFRESH_COOKIE, refreshTokenToSend);
        response.status(200).json({
          success: true,
          message: MESSAGES.ACCESS_TOKEN_GENERATED,
          "auth-token": accessTokenToSend,
        });
      } else {
        throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
      }
    } catch (error) {
      next(error);
    }
  };
}
export default AuthController;
