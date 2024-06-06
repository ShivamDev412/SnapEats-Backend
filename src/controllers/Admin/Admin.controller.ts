import { Request, Response, NextFunction } from "express";
import AdminService from "../../services/Admin/Admin.service";
import {
  ADMIN_REFRESH_COOKIE,
  MESSAGES,
  STATUS_CODE,
} from "../../utils/Constant";
import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  getAdminRefreshToken,
  updateAdmin,
} from "../../dbConfig/queries/Admin.query";
import { clearCookie } from "../../utils/HandleCookies";
class AdminController {
  private adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }
  logOut = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const cookies = req.cookies;
    const refreshToken = cookies[ADMIN_REFRESH_COOKIE];
    console.log("userId", userId);
    if (!refreshToken) {
      return new NotFoundError(MESSAGES.REFRESH_TOKEN_NOT_FOUND);
    }
    try {
      const existingUser = await getAdminRefreshToken(userId as string);
      const deleteRefreshTokenFromDb = await updateAdmin(userId as string, {
        refreshTokens: existingUser?.refreshTokens.filter((token) => {
          return token !== refreshToken;
        }),
      });

      if (!deleteRefreshTokenFromDb) {
        return new InternalServerError(MESSAGES.INTERNAL_SERVER_ERROR);
      } else {
        clearCookie(res, ADMIN_REFRESH_COOKIE);
        res.status(200).json({
          success: true,
          message: MESSAGES.LOGGED_OUT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
export default AdminController;
