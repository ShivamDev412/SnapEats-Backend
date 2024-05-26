import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../utils/Constant";
import UserService from "../services/User.service";

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
   *       404:
   *         description: User not found
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
  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}
export default UserController;
