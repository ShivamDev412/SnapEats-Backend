import StoreService from "../../services/Store.service";
import e, { Request, Response, NextFunction } from "express";

class SoreController {
  storeService: StoreService;
  constructor() {
    this.storeService = new StoreService();
  }
  registerSore = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
      const { name, address, phoneNumber, countryCode, email, lat, lon } = req.body;

      const store = await this.storeService.registerStore(
        userId as string,
        name,
        address,
        lat,
        lon,
        phoneNumber,
        countryCode,
        email,
      );
      res.status(200).json({ store });
    } catch (error) {
      next(error);
    }
  };
}
export default SoreController;