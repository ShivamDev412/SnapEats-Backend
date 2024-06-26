import { AuthMiddleware } from "./../../middlewares/Auth.middleware";
import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../../utils/Endpoints";
import SoreController from "../../controllers/Store/Store.controller";
const routes = express.Router();
const storeController = new SoreController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");
routes.post(
  ENDPOINTS.REGISTER_STORE,
  AuthMiddleware,
  storeController.registerSore
);
routes.get(
  `${ENDPOINTS.PROFILE}/:id`,
  AuthMiddleware,
  storeController.getStoreByUser
);
routes.get(ENDPOINTS.PROFILE, AuthMiddleware, storeController.getStore);
routes.put(
  ENDPOINTS.PROFILE,
  upload,
  AuthMiddleware,
  storeController.updateStoreProfile
);
export default routes;
