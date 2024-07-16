import { MESSAGES } from "../../utils/Constant";
import PaymentService from "../../services/Store/Payment.service";
import { Request, Response, NextFunction } from "express";
class PaymentController {
  paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }
  linkBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    const {
      accountHolderName,
      accountNumber,
      transitNumber,
      institutionNumber,
      email,
    } = req.body;
    const ip = req.ip;
    try {
      const account = await this.paymentService.linkBankAccount(
        accountHolderName,
        accountNumber,
        transitNumber,
        institutionNumber,
        email,
        ip,
        storeId as string
      );
      res.json({
        message: MESSAGES.BANK_ACCOUNT_LINKED,
        data: account,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  getBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    try {
      const account = await this.paymentService.getBankAccount(
        storeId as string
      );
      res.json({
        message: MESSAGES.BANK_ACCOUNT_FETCHED,
        data: account,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  unlinkBankAccount = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    try {
      await this.paymentService.unlinkBankAccount(storeId as string);
      res.json({
        message: MESSAGES.BANK_ACCOUNT_UNLINKED,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default PaymentController;
