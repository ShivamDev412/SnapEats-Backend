import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import ProfileService from "../../services/User/Profile.service";

class ProfileController {
  private profileService: ProfileService;
  constructor() {
    this.profileService = new ProfileService();
  }
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

  updatePhoneNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id;
    const { phoneNumber, countryCode } = req.body;
    try {
      const updatedUser = await this.profileService.updatePhoneNumber(
        userId as string,
        phoneNumber,
        countryCode
      );

      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedUser,
        message: MESSAGES.PHONE_NUMBER_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/send-phoneNumber-otp:
   *   post:
   *     summary: Send OTP to user's phone number
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
   *                 example: "+1234567890"
   *     responses:
   *       200:
   *         description: OTP sent successfully
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
   *                   example: "OTP sent successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  sendPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const userId = req.user?.id;
    try {
      const message = await this.profileService.sendPhoneNumberOTP(
        userId as string,
        phoneNumber
      );
      if (message.sid) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.OTP_SENT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/verify-phoneNumber-otp:
   *   post:
   *     summary: Verify OTP for phone number
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
   *               otp:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Phone number verified successfully
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
   *                     phoneNumberVerified:
   *                       type: boolean
   *                       example: true
   *                 message:
   *                   type: string
   *                   example: "Phone number verified successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  verifyPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { otp } = req.body;
    const userId = req.user?.id;
    try {
      const updatedUser = await this.profileService.verifyOTP(
        userId as string,
        otp
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedUser,
        message: MESSAGES.PHONE_NUMBER_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/resend-phoneNumber-otp:
   *   post:
   *     summary: Resend OTP to user's phone number
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OTP resent successfully
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
   *                   example: "OTP resent successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  resendPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id;
    try {
      const message = await this.profileService.resendPhoneNumberOTP(
        userId as string
      );
      if (message.sid) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.OTP_RESENT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/send-email-otp:
   *   post:
   *     summary: Send OTP to user's email
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
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *     responses:
   *       200:
   *         description: OTP sent successfully
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
   *                   example: "OTP sent successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  sendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const userId = req.user?.id;
    try {
      const emailResponse = await this.profileService.sendEmailOTP(
        userId as string,
        email
      );
      if (emailResponse) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.OTP_SENT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/verify-email-otp:
   *   post:
   *     summary: Verify OTP for email
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
   *               otp:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Email verified successfully
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
   *                     emailVerified:
   *                       type: boolean
   *                       example: true
   *                 message:
   *                   type: string
   *                   example: "Email verified successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  verifyEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const userId = req.user?.id;
    console.log(otp);
    try {
      const updatedUser = await this.profileService.verifyEmailOTP(
        userId as string,
        otp
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedUser,
        message: MESSAGES.EMAIL_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/resend-email-otp:
   *   post:
   *     summary: Resend OTP to user's email
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OTP resent successfully
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
   *                   example: "OTP resent successfully"
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal server error
   */

  resendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
      const emailResponse = await this.profileService.resendEmailOTP(
        userId as string
      );
      if (emailResponse) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: MESSAGES.OTP_RESENT,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
export default ProfileController;
