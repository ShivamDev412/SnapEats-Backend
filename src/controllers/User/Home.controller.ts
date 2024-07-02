import { Request, Response, NextFunction } from "express";
import HomeService from "../../services/User/Home.service";
import { getStoreMenuCategories } from "../../dbConfig/queries/Store.query";
type GetStoreQuery = {
  lat: number;
  lon: number;
  search: string;
  foodTypeId: string;
};
class HomeController {
  homeService: HomeService;
  constructor() {
    this.homeService = new HomeService();
  }
  getStores = async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lon, search, foodTypeId } =
      req.query as unknown as GetStoreQuery;
    try {
      const stores = await this.homeService.getStores(
        lat,
        lon,
        search,
        foodTypeId
      );
      return res.status(200).json({
        data: stores,
        message: "Stores fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  getstorePrimaryDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { storeId } = req.params;
    const { lat, lon } = req.query as unknown as GetStoreQuery;
    try {
      const store = await this.homeService.getStorePrimaryDetails(
        storeId,
        lat,
        lon
      );
      console.log(store);
      return res.status(200).json({
        data: store,
        message: "Store details fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  getStoreCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { storeId } = req.params;
    try {
      const categories = await getStoreMenuCategories(storeId);
      return res.status(200).json({
        data: categories,
        message: "Store categories fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  getStoreMenuItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id as string;
    const { storeId } = req.params;
    try {
      const menuItems = await this.homeService.getStoreMenuItems(
        storeId,
        userId
      );
      return res.status(200).json({
        data: menuItems,
        message: "Store menu items fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
export default HomeController;
