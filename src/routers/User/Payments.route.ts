import express from "express";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import PaymentController from "../../controllers/User/Payment.controller";
import { ENDPOINTS } from "../../utils/Endpoints";
const routes = express.Router();
const paymentController = new PaymentController();


routes.post(
  `${ENDPOINTS.PAYMENTS}/:paymentMethodId`,
  AuthMiddleware,
  paymentController.setDefaultPaymentMethod
);
routes.delete(
  `${ENDPOINTS.PAYMENTS}/:paymentMethodId`,
  AuthMiddleware,
  paymentController.removePaymentMethod
);
routes.get(
  ENDPOINTS.PAYMENTS,
  AuthMiddleware,
  paymentController.getPaymentMethods
);
routes.post(
  ENDPOINTS.PAYMENTS,
  AuthMiddleware,
  paymentController.addNewPaymentMethod
);
export default routes;
