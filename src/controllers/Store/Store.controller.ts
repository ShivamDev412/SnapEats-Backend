import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import StoreService from "../../services/Store/Store.service";
import { Request, Response, NextFunction } from "express";
import { getStoreByUserId } from "../../dbConfig/queries/Store.query";

class SoreController {
  storeService: StoreService;
  constructor() {
    this.storeService = new StoreService();
  }
  registerSore = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
      const { name, address, phoneNumber, countryCode, email, lat, lon } =
        req.body;
      const store = await this.storeService.registerStore(
        userId as string,
        name,
        address,
        lat,
        lon,
        phoneNumber,
        countryCode,
        email
      );
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_REQUEST_SEND_SUCCESS,
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  };
  getStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const store = await getStoreByUserId(userId);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_FETCH_SUCCESS,
        success: true,
        data: store ? store : {},
      });
    } catch (error) {
      next(error);
    }
  };
}
export default SoreController;
