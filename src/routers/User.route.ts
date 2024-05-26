import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../utils/Endpoints";
import UserController from "../controllers/User.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
const routes = express.Router();
const userController = new UserController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");
routes.get("/", AuthMiddleware, userController.getUser);
routes.put(
  ENDPOINTS.UPDATE_PROFILE,
  AuthMiddleware,
  upload,
  userController.updateUserProfile
);

export default routes;
