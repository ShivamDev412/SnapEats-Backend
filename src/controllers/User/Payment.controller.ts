import { MESSAGES } from "../../utils/Constant";
import PaymentService from "../../services/User/Payment.service";
import { Request, Response, NextFunction } from "express";
class PaymentController {
  private paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }
  getPaymentMethods = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user?.id;
      const { paymentMethods, defaultPaymentMethod } =
        await this.paymentService.getPaymentMethods(userId as string);
      response.json({
        success: true,
        data: { paymentMethods, defaultPaymentMethod },
      });
    } catch (error: any) {
      next(error);
    }
  };
  addNewPaymentMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const { paymentMethodId } = req.body;
      await this.paymentService.addNewPaymentMethod(
        userId as string,
        paymentMethodId
      );
      res.json({
        success: true,
        message: MESSAGES.PAYMENT_METHOD_ADDED,
      });
    } catch (error: any) {
      next(error);
    }
  };
  setDefaultPaymentMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const paymentMethodId = req.params.paymentMethodId;
      await this.paymentService.setDefaultPaymentMethod(
        userId as string,
        paymentMethodId
      );
      res.json({
        success: true,
        message: MESSAGES.PAYMENT_METHOD_SET_AS_DEFAULT,
      });
    } catch (error: any) {
      next(error);
    }
  };
  removePaymentMethod = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const paymentMethodId = req.params.paymentMethodId;
      await this.paymentService.removePaymentMethod(
        userId as string,
        paymentMethodId
      );
      res.json({
        success: true,
        message: MESSAGES.PAYMENT_METHOD_REMOVED,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
export default PaymentController;
