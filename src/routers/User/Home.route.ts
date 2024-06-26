import express from "express";

import { ENDPOINTS } from "../../utils/Endpoints";
import HomeController from "../../controllers/User/Home.controller";
const routes = express.Router();
const homeController = new HomeController();

routes.get("/", homeController.getStores);
export default routes;