import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODE } from "../utils/Constant";
import UserService from "../services/User.service";
import { UserProfileSchema } from "../Schemas/UserProfile.schema";
import { z } from "zod";

class UserController {
  userService: UserService;
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
   * /user/update-profile:
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
    const { firstName, lastName } = UserProfileSchema.parse(req.body);
    const file = req.file;
    try {
      const user = await this.userService.updateUserProfile(
        req.user?.id as string,
        firstName,
        lastName,
        file
      );
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.USER_PROFILE_UPDATED,
        data: user,
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
  // forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  //   const { email } = req.body;
  //   try {
  //     const user = await this.userService.forgotPassword(email);
  //     res.status(STATUS_CODE.OK).json({
  //       message: MESSAGES.PASSWORD_RESET_LINK_SENT,
  //       data: user,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {};
}
export default UserController;
