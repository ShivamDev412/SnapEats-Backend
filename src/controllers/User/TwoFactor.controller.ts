import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import TwoFAService from "../../services/User/TwoFA.service";

class TwoFactorAuth {
  twoFAService: TwoFAService;
  constructor() {
    this.twoFAService = new TwoFAService();
  }
  enableTwoFactorAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user?.id as string;
      const qrCode = await this.twoFAService.enableTwoFactorAuthentication(
        userId
      );
      response.json({
        data: {
          qrCode: qrCode,
        },
        success: true,
        message: MESSAGES.ENABLE_2FA,
      });
    } catch (error: any) {
      next(error);
    }
  };
  verifyTwoFactorAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user?.id as string;
      const { token } = request.body;
      const verified = await this.twoFAService.verifyTwoFactorAuthentication(
        userId,
        token
      );
      if (verified)
        response.json({ success: true, message: MESSAGES.ENABLE_2FA });
      else
        response
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_TOKEN });
    } catch (error: any) {
      next(error);
    }
  };
  getTwoFactorStatus = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user?.id as string;
      const { twoFactorStatus, is2FAExpired } =
        await this.twoFAService.getTwoFactorStatus(userId);
      if (is2FAExpired) {
        response.status(STATUS_CODE.OK).json({
          success: false,
          message: MESSAGES.VERIFY_2FA_EXPIRED,
          data: { twoFactorStatus },
        });
      } else {
        response.json({
          success: true,
          data: { twoFactorStatus },
        });
      }
    } catch (error) {
      next(error);
    }
  };
  disableTwoFactorAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user?.id as string;
      await this.twoFAService.disableTwoFactorAuthentication(userId);
      response.json({ success: true, message: MESSAGES.DISABLE_2FA });
    } catch (error: any) {
      next(error);
    }
  };
}
export default TwoFactorAuth;
