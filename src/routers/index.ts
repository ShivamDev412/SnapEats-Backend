import express from "express";
import authRoute from "./User/Auth.route";
import userRoute from "./User/User.route";
import userAddressRoute from "./User/Address.route";
import userProfileRoute from "./User/Profile.route";
import adminAutRoute from "./Admin/Auth.route";
import adminRoute from "./Admin/Admin.route";
import storeRoute from "./Store/Store.route";
import storeProfileRoute from "./Store/Profile.route";
import { RESOURCE_PATH } from "../utils/Endpoints";
const routes = express.Router();

routes.use(RESOURCE_PATH.AUTH, authRoute);
routes.use(RESOURCE_PATH.USER, userRoute, userAddressRoute, userProfileRoute);
routes.use(RESOURCE_PATH.STORE, storeRoute,storeProfileRoute);
routes.use(RESOURCE_PATH.ADMIN_AUTH, adminAutRoute);
routes.use(RESOURCE_PATH.ADMIN, adminRoute);
export default routes;
