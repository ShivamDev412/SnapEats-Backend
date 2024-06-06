import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import AdminController from "../../controllers/Admin/Admin.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";

const routes = express.Router();

const adminController = new AdminController();

routes.post(ENDPOINTS.LOGOUT, AuthMiddleware, adminController.logOut);

export default routes;
