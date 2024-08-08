import express from "express";
import { RESOURCE_PATH } from "../utils/Endpoints";
import authRoute from "./User/Auth.route";
import userRoute from "./User/User.route";
import userAddressRoute from "./User/Address.route";
import userProfileRoute from "./User/Profile.route";
import settingsRoute from "./User/Settings.route";
import adminAutRoute from "./Admin/Auth.route";
import adminRoute from "./Admin/Admin.route";
import cartRoute from "./User/Cart.route";
import storeRoute from "./Store/Store.route";
import checkoutRoute from "./User/Checkout.route";
import storeMenuRoute from "./Store/Menu.route";
import homeRoute from "./User/Home.route";
import storeProfileRoute from "./Store/Profile.route";
import twoFaRoute from "./User/TwoFactor.route";
import paymentRoutes from "../routers/User/Payments.route";
import storeOrderRoutes from "../routers/Store/Order.route";
import orderRoutes from "../routers/User/Order.route";
import deliveryRotes from "../routers/Store/Delivery.route";
const routes = express.Router();

routes.use(RESOURCE_PATH.AUTH, authRoute);
routes.use(
  RESOURCE_PATH.USER,
  userRoute,
  userAddressRoute,
  userProfileRoute,
  settingsRoute,
  cartRoute,
  checkoutRoute,
  paymentRoutes,
  twoFaRoute,
  orderRoutes
);
routes.use(RESOURCE_PATH.HOME, homeRoute);
routes.use(
  RESOURCE_PATH.STORE,
  storeRoute,
  storeProfileRoute,
  storeMenuRoute,
  storeOrderRoutes,
  deliveryRotes
);
routes.use(RESOURCE_PATH.ADMIN_AUTH, adminAutRoute);
routes.use(RESOURCE_PATH.ADMIN, adminRoute);
export default routes;
