import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import ProfileController from "../../controllers/Store/Profile.controller";

const routes = express.Router();
const userProfileController = new ProfileController();
routes.put(
  ENDPOINTS.UPDATE_PHONE_NUMBER,
  AuthMiddleware,
  userProfileController.updatePhoneNumber
);
routes.post(
  ENDPOINTS.SEND_OTP,
  AuthMiddleware,
  userProfileController.sendPhoneNumberOTP
);
routes.post(
  ENDPOINTS.VERIFY_OTP,
  AuthMiddleware,
  userProfileController.verifyPhoneNumberOTP
);
routes.post(
  ENDPOINTS.SEND_EMAIL_OTP,
  AuthMiddleware,
  userProfileController.sendEmailOTP
);
routes.post(
  ENDPOINTS.VERIFY_EMAIL_OTP,
  AuthMiddleware,
  userProfileController.verifyEmailOTP
);
routes.post(
  ENDPOINTS.RESEND_EMAIL_OTP,
  AuthMiddleware,
  userProfileController.resendEmailOTP
);
routes.get(ENDPOINTS.FOOD_TYPE, AuthMiddleware, userProfileController.getFoodTypes);
routes.post(
  ENDPOINTS.FOOD_TYPE,
  AuthMiddleware,
  userProfileController.addFoodType
);
routes.delete(
  ENDPOINTS.FOOD_TYPE,
  AuthMiddleware,
  userProfileController.removeFoodType
);
routes.get(
  ENDPOINTS.STORE_FOOD_TYPE,
  AuthMiddleware,
  userProfileController.getStoreFoodTypes
);
routes.get(ENDPOINTS.STORE_TIMING, AuthMiddleware, userProfileController.getStoreTiming);
routes.put(
  ENDPOINTS.STORE_TIMING,
  AuthMiddleware,
  userProfileController.updateStoreTiming
);

export default routes;
