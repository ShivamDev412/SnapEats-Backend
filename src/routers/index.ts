import express from "express";
import authRoute from "./Auth.route";
import userRoute from "./User.route";
import { RESOURCE_PATH } from "../utils/Endpoints";
const routes = express.Router();

routes.use(RESOURCE_PATH.AUTH, authRoute);
routes.use(RESOURCE_PATH.USER, userRoute);
export default routes;
