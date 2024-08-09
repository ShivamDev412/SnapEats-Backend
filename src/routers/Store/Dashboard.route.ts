import { AuthMiddleware } from "../../middlewares/Auth.middleware";
import { ENDPOINTS } from "../../utils/Endpoints";
import DashboardController from "../../controllers/Store/Dashboard.controller";
import express from "express";
const routes = express.Router();
const dashboardController = new DashboardController();

routes.get(
  ENDPOINTS.OVERVIEW_METRICS,
  AuthMiddleware,
  dashboardController.getOverViewMetrics
);
routes.get(
  ENDPOINTS.ORDER_STATS,
  AuthMiddleware,
  dashboardController.getOrderStats
);
routes.get(
  ENDPOINTS.REVENUE_TRENDS,
  AuthMiddleware,
  dashboardController.getRevenueTrends
);
export default routes;
