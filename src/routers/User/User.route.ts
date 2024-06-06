import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../../utils/Endpoints";
import UserController from "../../controllers/User/User.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";

const routes = express.Router();
const userController = new UserController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profilePicture");
routes.get("/", AuthMiddleware, userController.getUser);
routes.put("/", upload, AuthMiddleware, userController.updateUserProfile);
routes.post(ENDPOINTS.FORGOT_PASSWORD, userController.forgotPassword);
routes.post(ENDPOINTS.RESET_PASSWORD, userController.resetPassword);
routes.post(ENDPOINTS.LOGOUT, AuthMiddleware, userController.logOut);

export default routes;
