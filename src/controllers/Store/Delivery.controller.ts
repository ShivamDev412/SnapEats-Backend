import DeliveryService from "../../services/Store/Delivery.service";
import { Request, Response, NextFunction } from "express";
class DeliveryController {
  private deliveryService: DeliveryService;
  constructor() {
    this.deliveryService = new DeliveryService();
  }
  ourForDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      await this.deliveryService.outForDelivery(orderId);
      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default DeliveryController;
