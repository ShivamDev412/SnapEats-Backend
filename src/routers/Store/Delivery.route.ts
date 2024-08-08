import { AuthMiddleware } from '../../middlewares/Auth.middleware';
import express from 'express';
import DeliveryController from '../../controllers/Store/Delivery.controller';
import { ENDPOINTS } from '../../utils/Endpoints';
const router = express.Router();
const deliveryController = new DeliveryController();

router.post(ENDPOINTS.OUT_FOR_DELIVERY, AuthMiddleware, deliveryController.ourForDelivery);
export default router;