import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../utils/Constant";
import SettingsService from "../../services/User/Settings.service";
import { ChangePasswordSchema } from "../../Schemas/UserProfile.schema";

class SettingsController {
  private settingsService: SettingsService;
  constructor() {
    this.settingsService = new SettingsService();
  }
   /**
   * @swagger
   * /user/change-language/{lang}:
   *   put:
   *     summary: Change user's preferred language
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: lang
   *         schema:
   *           type: string
   *         required: true
   *         description: Language code (e.g., en, es)
   *     responses:
   *       200:
   *         description: Language updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Language updated successfully"
   *                 success:
   *                   type: boolean
   *                   example: true
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */
  changeLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lang } = req.params;
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

  /**
   * @swagger
   * /user/change-password:
   *   put:
   *     summary: Change user's password
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *               - confirmNewPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 example: "current_password"
   *               newPassword:
   *                 type: string
   *                 example: "new_password"
   *               confirmNewPassword:
   *                 type: string
   *                 example: "new_password"
   *     responses:
   *       200:
   *         description: Password updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Password updated successfully"
   *                 success:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Bad request
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */
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
