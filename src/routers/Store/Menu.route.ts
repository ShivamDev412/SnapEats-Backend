import { AuthMiddleware } from "./../../middlewares/Auth.middleware";
import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../../utils/Endpoints";
import MenuController from "../../controllers/Store/Menu.controller";
const routes = express.Router();
const menuController = new MenuController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

routes.get(
  `${ENDPOINTS.MENU}${ENDPOINTS.CATEGORIES}`,
  AuthMiddleware,
  menuController.getCategories
);
routes.get(
  `${ENDPOINTS.MENU}${ENDPOINTS.OPTIONS}`,
  AuthMiddleware,
  menuController.getOptions
);
routes.get(
  `${ENDPOINTS.MENU}${ENDPOINTS.CHOICE}/:optionId`,
  AuthMiddleware,
  menuController.getChoices
);
routes.get(
  `${ENDPOINTS.MENU}/:menuId`,
  AuthMiddleware,
  menuController.getMenuItemDetails
);
routes.delete(
  `${ENDPOINTS.MENU}/:menuId`,
  AuthMiddleware,
  menuController.deleteMenuItem
);
routes.get(ENDPOINTS.MENU, AuthMiddleware, menuController.getMenuItems);
routes.put(ENDPOINTS.MENU, upload, AuthMiddleware, menuController.updateMenuItem);
routes.post(ENDPOINTS.MENU, AuthMiddleware, upload, menuController.addMenuitem);

export default routes;
