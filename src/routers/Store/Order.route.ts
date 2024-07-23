import express from 'express';
import { AuthMiddleware } from '../../middlewares/Auth.middleware';
const routes = express.Router();
import { ENDPOINTS } from '../../utils/Endpoints';
import OrderController from '../../controllers/Store/Order.controller';
const orderController = new OrderController();

routes.post(
    ENDPOINTS.ACCEPT_ORDER,
    AuthMiddleware,
    orderController.acceptOrder
);
routes.post(
    ENDPOINTS.CANCEL_ORDER,
    AuthMiddleware,
    orderController.cancelOrder
);
export default routes;
