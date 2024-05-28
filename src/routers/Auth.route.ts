import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../utils/Endpoints";
import AuthController from "../controllers/Auth.controller";
const routes = express.Router();
const authController = new AuthController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");
routes.post(ENDPOINTS.LOGIN, authController.login);
routes.post(ENDPOINTS.SIGNUP, upload, authController.signup);
routes.get(ENDPOINTS.REFRESH_TOKEN, authController.refreshToken);


export default routes;
