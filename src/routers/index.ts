import express from "express";
import authRoute from "./Auth.route";
import { RESOURCE_PATH } from "../utils/Endpoints";
const routes = express.Router();

routes.use(RESOURCE_PATH.AUTH, authRoute);
export default routes;
