import express from "express";
import { AuthMiddleware } from "./../../middlewares/Auth.middleware";
import { ENDPOINTS } from "../../utils/Endpoints";
import PaymentController from "../../controllers/Store/Payment.controller";
const route = express.Router();
const paymentController = new PaymentController();

route.get(
  ENDPOINTS.BANK_ACCOUNT,
  AuthMiddleware,
  paymentController.getBankAccount
);
route.post(
  ENDPOINTS.BANK_ACCOUNT,
  AuthMiddleware,
  paymentController.linkBankAccount
);
route.delete(
  ENDPOINTS.BANK_ACCOUNT,
  AuthMiddleware,
  paymentController.unlinkBankAccount
);
export default route;