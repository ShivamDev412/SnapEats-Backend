import { Request, Response, NextFunction } from "express";
import OrderService from "../../services/User/Order.service";

class OrderController {
  private orderService: OrderService;
  constructor() {
    this.orderService = new OrderService();
  }
  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const { page } = req.query as { page: string };
      const { orders, totalCount } = await this.orderService.getOrders(
        userId,
        +page
      );
      res.status(200).json({
        success: true,
        data: {
          orders,
          totalCount,
          page: +page,
        },
      });
    } catch (error: any) {
      next(error);
    }
  };
}
export default OrderController;
