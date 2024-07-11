import express from "express";

import { ENDPOINTS } from "../../utils/Endpoints";
import HomeController from "../../controllers/User/Home.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";
const routes = express.Router();
const homeController = new HomeController();

routes.get(
  `${ENDPOINTS.HOME_STORE_PRIMARY_DETAILS}/:storeId`,
  AuthMiddleware,
  homeController.getstorePrimaryDetails
);
routes.get(
  `${ENDPOINTS.HOME_STORE_CATEGORY}/:storeId`,
  AuthMiddleware,
  homeController.getStoreCategories
);
routes.get(
  `${ENDPOINTS.HOME_STORE_MENU}/:storeId`,
  AuthMiddleware,
  homeController.getStoreMenuItems
);
routes.get("/", homeController.getStores);
export default routes;
