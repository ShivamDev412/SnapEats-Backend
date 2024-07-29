import { Request, Response, NextFunction } from "express";
import { MESSAGES, REFRESH_COOKIE, STATUS_CODE } from "../../utils/Constant";
import UserService from "../../services/User/User.service";
import {
  ResetPasswordSchema,
  UserProfileSchema,
} from "../../Schemas/UserProfile.schema";
import { z } from "zod";
import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  getUserRefreshToken,
  updateUser,
} from "../../dbConfig/queries/User/User.query";
import { clearCookie } from "../../utils/HandleCookies";

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Get user information
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     profilePicture:
   *                       type: string
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUser(req.user?.id as string);

      res.status(STATUS_CODE.OK).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user:
   *   put:
   *     summary: Update user profile
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 description: The first name of the user
   *               lastName:
   *                 type: string
   *                 description: The last name of the user
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The profile picture of the user
   *     responses:
   *       200:
   *         description: User profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     profilePicture:
   *                       type: string
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName, email, profilePicture } = UserProfileSchema.parse(req.body);
    const file = req.file;
    try {
      const user = await this.userService.updateUserProfile(
        req.user?.id as string,
        firstName,
        lastName,
        email,
        file,
        profilePicture
      );
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.USER_PROFILE_UPDATED,
        data: user,
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
   * /user/forgot-password:
   *   post:
   *     summary: Request password reset link
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *     responses:
   *       200:
   *         description: Password reset link sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Password reset link sent successfully."
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
      const emailResponse = await this.userService.forgotPassword(email);
      if (emailResponse)
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.PASSWORD_RESET_LINK_SENT,
        });
      else {
        throw new InternalServerError(MESSAGES.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/reset-password:
   *   post:
   *     summary: Reset password
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *               - confirmPassword
   *               - token
   *             properties:
   *               password:
   *                 type: string
   *                 example: "newpassword123"
   *               confirmPassword:
   *                 type: string
   *                 example: "newpassword123"
   *               token:
   *                 type: string
   *                 example: "your_reset_token"
   *     responses:
   *       200:
   *         description: Password reset successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Password reset successfully."
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Validation error."
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: array
   *                         items:
   *                           type: string
   *                         example: ["password"]
   *                       message:
   *                         type: string
   *                         example: "Password is required."
   *       500:
   *         description: Internal server error
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const result = ResetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: "Validation Error",
        errors: result.error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    const { password, token } = result.data;
    try {
      const updatedUser = await this.userService.resetPassword(password, token);
      if (updatedUser)
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.PASSWORD_RESET_SUCCESS,
        });
      else {
        throw new InternalServerError(MESSAGES.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/logout:
   *   post:
   *     summary: Logs out the user
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Successfully logged out
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Refresh token not found
   *       500:
   *         description: Internal server error
   */
  logOut = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_COOKIE];
    if (!refreshToken) {
      return new NotFoundError(MESSAGES.REFRESH_TOKEN_NOT_FOUND);
    }
    try {
      const existingUser = await getUserRefreshToken(userId as string);
      const deleteRefreshTokenFromDb = await updateUser(userId as string, {
        refreshTokens: existingUser?.refreshTokens.filter((token) => {
          return token !== refreshToken;
        }),
      });

      if (!deleteRefreshTokenFromDb) {
        return new InternalServerError(MESSAGES.INTERNAL_SERVER_ERROR);
      } else {
        clearCookie(res, REFRESH_COOKIE);
        res.status(200).json({
          success: true,
          message: MESSAGES.LOGGED_OUT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/update-phone-number:
   *   put:
   *     summary: Update user's phone number
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               phoneNumber:
   *                 type: string
   *                 example: "2345678906"
   *               countryCode:
   *                 type: string
   *                 example: "+1"
   *     responses:
   *       200:
   *         description: Phone number updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "user-id"
   *                     phoneNumber:
   *                       type: string
   *                       example: "2345678905"
   *                     countryCode:
   *                       type: string
   *                       example: "+1"
   *                 message:
   *                   type: string
   *                   example: "Phone number updated successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */
  
}
export default UserController;
