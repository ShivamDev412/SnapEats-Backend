import { Request, Response, NextFunction } from "express";
import {
  totalNumberOfOrders,
  totalIncomeGenerated,
  averageOrderValue,
  ordersInLastWeek,
  ordersInLastMonth,
  ordersInLastYear,
  mostOrderedItems,
  ordersInLast3Months,
  ordersInLast6Months,
  dailyRevenueForLast30Days,
} from "../../dbConfig/queries/Store/Dashboard.query";
import { STATUS_CODE } from "../../utils/Constant";
class DashboardController {
  constructor() {}
  getOverViewMetrics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const storeId = req.params.storeId;
      const numberOfOrders = await totalNumberOfOrders(storeId);
      const totalRevenue = await totalIncomeGenerated(storeId);
      const averageOrderValueData = await averageOrderValue(storeId);
      const data = {
        numberOfOrders,
        totalRevenue,
        averageOrderValue: averageOrderValueData,
      };
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  getOrderStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.params.storeId;
      const lastWeekOrders = await ordersInLastWeek(storeId);
      const lastMonthOrders = await ordersInLastMonth(storeId);
      const lastThreeMonthsOrders = await ordersInLast3Months(storeId);
      const lastSixMonthsOrders = await ordersInLast6Months(storeId);
      const lastYearOrders = await ordersInLastYear(storeId);
      const topOrderedItems = await mostOrderedItems(storeId);
      console.log(topOrderedItems, "topOrderedItems");
      const data = {
        lastWeekOrders,
        lastMonthOrders,
        lastThreeMonthsOrders,
        lastSixMonthsOrders,
        lastYearOrders,
        mostOrderedItems: topOrderedItems,
      };

      res.status(STATUS_CODE.OK).json({
        success: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
  getRevenueTrends = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const storeId = req.params.storeId;
      const revenueTrends = await dailyRevenueForLast30Days(storeId);

      res.status(STATUS_CODE.OK).json({
        success: true,
        data: revenueTrends,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default DashboardController;
