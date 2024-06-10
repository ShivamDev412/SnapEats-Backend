import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import AuthController from "../../controllers/Admin/Auth.controller";
const routes = express.Router();
const authController = new AuthController();
routes.post(ENDPOINTS.LOGIN, authController.login);
routes.post(ENDPOINTS.SIGNUP, authController.signup);
routes.get(ENDPOINTS.REFRESH_TOKEN, authController.refreshToken);

export default routes;
