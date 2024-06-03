import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../utils/Endpoints";
import UserController from "../controllers/User.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
const routes = express.Router();
const userController = new UserController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profilePicture");
routes.get("/", AuthMiddleware, userController.getUser);
routes.put("/", upload,AuthMiddleware, userController.updateUserProfile);
routes.post(ENDPOINTS.FORGOT_PASSWORD, userController.forgotPassword);
routes.post(ENDPOINTS.RESET_PASSWORD, userController.resetPassword);
routes.post(ENDPOINTS.LOGOUT, AuthMiddleware, userController.logOut);
routes.get(ENDPOINTS.ADDRESS, AuthMiddleware, userController.address);
routes.post(ENDPOINTS.ADDRESS, AuthMiddleware, userController.createAddress);
routes.put(
  `${ENDPOINTS.ADDRESS}/:id`,
  AuthMiddleware,
  userController.updateAddress
);
routes.delete(
  `${ENDPOINTS.ADDRESS}/:id`,
  AuthMiddleware,
  userController.deleteAddress
);
routes.put(
  `${ENDPOINTS.MARK_ADDRESS_AS_DEFAULT}/:id`,
  AuthMiddleware,
  userController.markAddressAsDefault
);
routes.put(
  ENDPOINTS.UPDATE_PHONE_NUMBER,
  AuthMiddleware,
  userController.updatePhoneNumber
);
routes.post(
  ENDPOINTS.SEND_OTP,
  AuthMiddleware,
  userController.sendPhoneNumberOTP
);
routes.post(
  ENDPOINTS.VERIFY_OTP,
  AuthMiddleware,
  userController.verifyPhoneNumberOTP
);
routes.post(
  ENDPOINTS.SEND_EMAIL_OTP,
  AuthMiddleware,
  userController.sendEmailOTP
);
routes.post(
  ENDPOINTS.VERIFY_EMAIL_OTP,
  AuthMiddleware,
  userController.verifyEmailOTP
);
routes.post(
  ENDPOINTS.RESEND_EMAIL_OTP,
  AuthMiddleware,
  userController.resendEmailOTP
);

export default routes;
