import { ENDPOINTS } from "../../utils/Endpoints";
import SettingsController from "../../controllers/User/Settings.controller";
import express from "express";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";

const routes = express.Router();
const settingsController = new SettingsController();

routes.put(
  `${ENDPOINTS.CHANGE_LANGUAGE}/:lang`,
  AuthMiddleware,
  settingsController.changeLanguage
);
routes.put(
  ENDPOINTS.CHANGE_PASSWORD,
  AuthMiddleware,
  settingsController.changePassword
);
export default routes;
