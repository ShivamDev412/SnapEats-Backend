import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import AuthService from "../../services/Admin/Auth.service";
import { LoginSchema } from "../../Schemas/UserAuth.schema";
import { updateAdmin } from "../../dbConfig/queries/Admin.query";
import {
  ADMIN_REFRESH_COOKIE,
  MESSAGES,
  STATUS_CODE,
} from "../../utils/Constant";
import { clearCookie, setCookies } from "../../utils/HandleCookies";
import { AuthError, InternalServerError } from "../../utils/Error";

class AdminAuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { token, refreshToken } = await this.authService.signupUser(
        email,
        password
      );
      setCookies(res, ADMIN_REFRESH_COOKIE, refreshToken);
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
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const cookies = req.cookies;
      const { user, token, refreshToken } = await this.authService.loginUser(
        email,
        password
      );
      // Filter out old refresh tokens
      const newRefreshTokenArray = cookies[ADMIN_REFRESH_COOKIE]
        ? user.refreshTokens.filter(
            (rt: string) => rt !== cookies[ADMIN_REFRESH_COOKIE]
          )
        : user.refreshTokens;
      // Clear the old refresh token if it exists
      if (cookies[ADMIN_REFRESH_COOKIE]) {
        clearCookie(res, ADMIN_REFRESH_COOKIE);
      }
      await updateAdmin(user.id, {
        refreshTokens: [...newRefreshTokenArray, refreshToken],
      });
      setCookies(res, ADMIN_REFRESH_COOKIE, refreshToken);
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
      const refreshToken = cookies[ADMIN_REFRESH_COOKIE];
      if (!refreshToken) {
        return new AuthError(MESSAGES.INVALID_REFRESH_TOKEN);
      }
      const { accessTokenToSend, refreshTokenToSend } =
        await this.authService.refreshToken(refreshToken);
      if (accessTokenToSend && refreshTokenToSend) {
        setCookies(response, ADMIN_REFRESH_COOKIE, refreshTokenToSend);
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
export default AdminAuthController;
