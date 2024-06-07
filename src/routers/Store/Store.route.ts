import { AuthMiddleware } from './../../middlewares/Auth.middleware';
import express from "express";
import multer from "multer";
import { ENDPOINTS } from "../../utils/Endpoints";
import SoreController from "../../controllers/Store/Store.controller";
const routes = express.Router();
const storeController = new SoreController();

routes.post(ENDPOINTS.REGISTER_STORE, AuthMiddleware ,storeController.registerSore);
routes.get("/", AuthMiddleware, storeController.getStore);
export default routes;