import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import AdminController from "../../controllers/Admin/Admin.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";

const routes = express.Router();

const adminController = new AdminController();

routes.post(ENDPOINTS.LOGOUT, AuthMiddleware, adminController.logOut);
routes.get(ENDPOINTS.GET_STORE_REQUESTS, AuthMiddleware, adminController.getStoreRequests);
routes.post(ENDPOINTS.ACCEPT_STORE_REQUEST, AuthMiddleware, adminController.acceptStoreRequest);
routes.post(ENDPOINTS.REJECT_STORE_REQUEST, AuthMiddleware, adminController.rejectStoreRequest);
routes.get(ENDPOINTS.USERS, AuthMiddleware, adminController.getAllUsers);
routes.get(ENDPOINTS.STORES, AuthMiddleware, adminController.getAllStores);

export default routes;
