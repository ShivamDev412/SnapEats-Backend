import express from "express";

import { ENDPOINTS } from "../../utils/Endpoints";
import HomeController from "../../controllers/User/Home.controller";
const routes = express.Router();
const homeController = new HomeController();

routes.get(
  `${ENDPOINTS.HOME_STORE_PRIMARY_DETAILS}/:storeId`,
  homeController.getstorePrimaryDetails
);
routes.get(
  `${ENDPOINTS.HOME_STORE_CATEGORY}/:storeId`,
  homeController.getStoreCategories
);
routes.get(
  `${ENDPOINTS.HOME_STORE_MENU}/:storeId`,
  homeController.getStoreMenuItems
);
routes.get("/", homeController.getStores);
export default routes;
