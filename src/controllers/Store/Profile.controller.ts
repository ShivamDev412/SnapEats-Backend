import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import ProfileService from "../../services/Store/Profile.service";
import { getStoreTime } from "../../dbConfig/queries/Store.query";

class ProfileController {
  private profileService: ProfileService;
  constructor() {
    this.profileService = new ProfileService();
  }
  /**
   * @swagger
   * /store/update-phone-number:
   *   put:
   *     summary: Update store's phone number
   *     tags: [Store]
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
   *                       example: "store-id"
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
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */
  updatePhoneNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const storeId = req.user?.storeId;
    const { phoneNumber, countryCode } = req.body;
    try {
      const updatedStore = await this.profileService.updatePhoneNumber(
        storeId as string,
        phoneNumber,
        countryCode
      );

      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedStore,
        message: MESSAGES.PHONE_NUMBER_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/send-phoneNumber-otp:
   *   post:
   *     summary: Send OTP to store's phone number
   *     tags: [Store]
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
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  sendPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const storeId = req.user?.storeId;
    try {
      const message = await this.profileService.sendPhoneNumberOTP(
        storeId as string,
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
   * /store/verify-phoneNumber-otp:
   *   post:
   *     summary: Verify OTP for phone number
   *     tags: [Store]
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
   *                       example: "store-id"
   *                     phoneNumberVerified:
   *                       type: boolean
   *                       example: true
   *                 message:
   *                   type: string
   *                   example: "Phone number verified successfully"
   *       404:
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  verifyPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { otp } = req.body;
    const storeId = req.user?.storeId;
    try {
      const updatedStore = await this.profileService.verifyOTP(
        storeId as string,
        otp
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedStore,
        message: MESSAGES.PHONE_NUMBER_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/resend-phoneNumber-otp:
   *   post:
   *     summary: Resend OTP to store's phone number
   *     tags: [Store]
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
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  resendPhoneNumberOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const storeId = req.user?.storeId;
    try {
      const message = await this.profileService.resendPhoneNumberOTP(
        storeId as string
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
   * /store/send-email-otp:
   *   post:
   *     summary: Send OTP to store's email
   *     tags: [Store]
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
   *                 example: "store@example.com"
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
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  sendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const storeId = req.user?.storeId;
    try {
      const emailResponse = await this.profileService.sendEmailOTP(
        storeId as string,
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
   * /store/verify-email-otp:
   *   post:
   *     summary: Verify OTP for email
   *     tags: [Store]
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
   *                       example: "store-id"
   *                     emailVerified:
   *                       type: boolean
   *                       example: true
   *                 message:
   *                   type: string
   *                   example: "Email verified successfully"
   *       404:
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  verifyEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const storeId = req.user?.storeId;
    try {
      const updatedStore = await this.profileService.verifyEmailOTP(
        storeId as string,
        otp
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedStore,
        message: MESSAGES.EMAIL_VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/resend-email-otp:
   *   post:
   *     summary: Resend OTP to store's email
   *     tags: [Store]
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
   *         description: Store Not Found
   *       500:
   *         description: Internal server error
   */

  resendEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    try {
      const emailResponse = await this.profileService.resendEmailOTP(
        storeId as string
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
    /**
   * @swagger
   * /store/food-types:
   *   get:
   *     summary: Get all food types
   *     tags: [Store]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully fetched food types
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Type 1", "Type 2"]
   *       500:
   *         description: Internal server error
   */
  getFoodTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const foodTypes = await this.profileService.getFoodTypes();
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: foodTypes,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/food-types:
   *   post:
   *     summary: Add a new food type
   *     tags: [Store]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: "food-type-id"
   *     responses:
   *       201:
   *         description: Food type added successfully
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
   *                       example: "food-type-id"
   *                 message:
   *                   type: string
   *                   example: "Food type added successfully"
   *       500:
   *         description: Internal server error
   */
  addFoodType = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const storeId = req.user?.storeId;
    try {
      const foodType = await this.profileService.addFoodType(
        id,
        storeId as string,
      );
      res.status(STATUS_CODE.CREATED).json({
        success: true,
        data: foodType,
        message: MESSAGES.FOOD_TYPE_ADDED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/food-types:
   *   delete:
   *     summary: Remove a food type
   *     tags: [Store]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: "food-type-id"
   *     responses:
   *       200:
   *         description: Food type removed successfully
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
   *                   example: "Food type removed successfully"
   *       500:
   *         description: Internal server error
   */
  removeFoodType = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const storeId = req.user?.storeId;
    try {
      await this.profileService.removeFoodType(id, storeId as string);
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: MESSAGES.FOOD_TYPE_REMOVED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /store/store-food-types:
   *   get:
   *     summary: Get food types for a store
   *     tags: [Store]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully fetched store food types
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Store Type 1", "Store Type 2"]
   *       500:
   *         description: Internal server error
   */
  getStoreFoodTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const storeId = req.user?.storeId;
    try {
      const foodTypes = await this.profileService.getStoreFoodTypes(
        storeId as string
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: foodTypes,
      });
    } catch (error) {
      next(error);
    }
  };
  updateStoreTiming = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    const { openTime, closeTime, type } = req.body;
    try {
      const updatedStore = await this.profileService.setStoreTiming(
        storeId as string,
        openTime, closeTime, type
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedStore,
        message: MESSAGES.STORE_TIMING_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  };
  getStoreTiming = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    try {
      const storeTiming = await getStoreTime(storeId as string);
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: storeTiming,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default ProfileController;
