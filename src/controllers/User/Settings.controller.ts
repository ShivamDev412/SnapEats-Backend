import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../utils/Constant";
import SettingsService from "../../services/User/Settings.service";
import { ChangePasswordSchema } from "../../Schemas/UserProfile.schema";

class SettingsController {
  settingsService: SettingsService;
  constructor() {
    this.settingsService = new SettingsService();
  }
  changeLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lang } = req.params;
      console.log(lang);
      const userId = req.user?.id as string;
      await this.settingsService.changeLanguage(lang, userId);
      res.status(200).json({
        message: MESSAGES.LANGUAGE_UPDATED,
        success: true,
      });
    } catch (error: any) {
      next(error);
    }
  };
  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } =
        ChangePasswordSchema.parse(req.body);
      const userId = req.user?.id as string;
      const updatedUser = await this.settingsService.changePassword(
        currentPassword,
        newPassword,
        userId
      );
      console.log(updatedUser, "updatedUser");
      if (updatedUser)
        res.status(200).json({
          message: MESSAGES.PASSWORD_UPDATED,
          success: true,
        });
    } catch (error: any) {
      next(error);
    }
  };
}
export default SettingsController;
