import express from "express";
import authRoute from "./User/Auth.route";
import userRoute from "./User/User.route";
import userAddressRoute from "./User/Address.route";
import userProfileRoute from "./User/Profile.route";
import settingsRoute from "./User/Settings.route";
import adminAutRoute from "./Admin/Auth.route";
import adminRoute from "./Admin/Admin.route";
import cartRoute from "./User/Cart.route";
import storeRoute from "./Store/Store.route";
import storeMenuRoute from "./Store/Menu.route";
import homeRoute from "./User/Home.route";
import storeProfileRoute from "./Store/Profile.route";
import { RESOURCE_PATH } from "../utils/Endpoints";
const routes = express.Router();

routes.use(RESOURCE_PATH.AUTH, authRoute);
routes.use(
  RESOURCE_PATH.USER,
  userRoute,
  userAddressRoute,
  userProfileRoute,
  settingsRoute,
  cartRoute
);
routes.use(RESOURCE_PATH.HOME, homeRoute);
routes.use(RESOURCE_PATH.STORE, storeRoute, storeProfileRoute, storeMenuRoute);
routes.use(RESOURCE_PATH.ADMIN_AUTH, adminAutRoute);
routes.use(RESOURCE_PATH.ADMIN, adminRoute);
export default routes;
