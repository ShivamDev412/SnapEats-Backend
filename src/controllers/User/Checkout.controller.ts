import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import { Request, Response, NextFunction } from "express";
import CheckoutService from "../../services/User/Checkout.Service";

class CheckoutController {
  private checkoutService: CheckoutService;
  constructor() {
    this.checkoutService = new CheckoutService();
  }
  getOrderSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const orderSummary = await this.checkoutService.getOrderSummary(userId);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_SUMMARY_FETCHED,
        data: orderSummary,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const { amount, orderItems } = req.body;
      const order = await this.checkoutService.processOrder(
        userId,
        amount,
        orderItems
      );
      res.status(STATUS_CODE.CREATED).json({
        message: MESSAGES.ORDER_PLACED,
        data: order,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default CheckoutController;
