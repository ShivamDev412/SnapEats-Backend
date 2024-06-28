import { Request, Response, NextFunction } from "express";
import HomeService from "../../services/User/Home.service";
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
  getstoreDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { storeId } = req.params;
    const { lat, lon } = req.query as unknown as GetStoreQuery;
    try {
      const store = await this.homeService.getStoreDetails(storeId, lat, lon);
      console.log(store);
      return res.status(200).json({
        data: store,
        message: "Store details fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
export default HomeController;
