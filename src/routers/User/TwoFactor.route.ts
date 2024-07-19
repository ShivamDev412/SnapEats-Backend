import express from "express";
import TwoFAController from "../../controllers/User/TwoFactor.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import { ENDPOINTS } from "../../utils/Endpoints";
const routes = express.Router();
const twoFactorAuthController = new TwoFAController();

routes.post(
  ENDPOINTS.ENABLE_2FA,
  AuthMiddleware,
  twoFactorAuthController.enableTwoFactorAuth
);
routes.get(
  ENDPOINTS.TWO_FA_STATUS,
  AuthMiddleware,
  twoFactorAuthController.getTwoFactorStatus
);
routes.post(
  ENDPOINTS.VERIFY_2FA,
  AuthMiddleware,
  twoFactorAuthController.verifyTwoFactorAuth
);
routes.post(
  ENDPOINTS.DISABLE_2FA,
  AuthMiddleware,
  twoFactorAuthController.disableTwoFactorAuth
);
export default routes;
