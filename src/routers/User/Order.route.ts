import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import { ENDPOINTS } from "../../utils/Endpoints";
import OrderController from "../../controllers/User/Order.controller";
import { Router } from "express";
const routes = Router();
const orderController = new OrderController();
routes.get(ENDPOINTS.ORDER, AuthMiddleware, orderController.getOrders);
export default routes;
