import OrderService from "../../services/Store/Order.service";
import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import { Request, Response, NextFunction } from "express";
class OrderController {
  private orderService: OrderService;
  constructor() {
    this.orderService = new OrderService();
  }
  acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const paymentIntent = await this.orderService.acceptOrder(orderId);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.PAYMENT_PROCESSED,
        data: paymentIntent,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const order = await this.orderService.cancelOrder(orderId);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.ORDER_CANCELLED,
        data: order,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default OrderController;
