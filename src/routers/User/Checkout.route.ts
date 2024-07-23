import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import { ENDPOINTS } from "../../utils/Endpoints";
import CheckoutController from "../../controllers/User/Checkout.controller";
import express from "express";
const routes = express.Router();
const checkoutController = new CheckoutController();

routes.get(
  ENDPOINTS.CHECKOUT,
  AuthMiddleware,
  checkoutController.getOrderSummary
);
routes.post(
  ENDPOINTS.PLACE_ORDER,
  AuthMiddleware,
  checkoutController.placeOrder
);
export default routes;
