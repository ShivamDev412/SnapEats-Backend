import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import CartController from "../../controllers/User/Cart.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";
const cartController = new CartController();

const routes = express.Router();
routes.put(`${ENDPOINTS.CART}/note`, AuthMiddleware, cartController.addNoteToItem);
routes.get(ENDPOINTS.CART, AuthMiddleware, cartController.getCart);
routes.post(ENDPOINTS.CART, AuthMiddleware, cartController.addToCart);
routes.put(ENDPOINTS.CART, AuthMiddleware, cartController.updateCartQuantity);
routes.delete(ENDPOINTS.CART, AuthMiddleware, cartController.removeFromCart);

export default routes;
