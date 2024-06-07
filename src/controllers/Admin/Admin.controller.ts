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
  getStoreRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const storeRequests = await this.adminService.getStoreRequests();
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: storeRequests,
        message: MESSAGES.STORE_REQUEST_FETCH_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };
  acceptStoreRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { storeId } = req.body
      const store = await this.adminService.acceptStoreRequest(storeId);
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: store,
        message: MESSAGES.STORE_REQUEST_ACCEPTED,
      });
    } catch (error) {
      next(error);
    }
  };
  rejectStoreRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { storeId, userId } = req.body;
      const isStoreRemoved = await this.adminService.rejectStoreRequest(
        storeId,
        userId
      );
      if (isStoreRemoved) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.STORE_REQUEST_REJECTED,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
export default AdminController;
