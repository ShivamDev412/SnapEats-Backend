import { MESSAGES } from "../../utils/Constant";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../../dbConfig/queries/User/Cart.query";
import CartService from "../../services/User/Cart.service";
import { Request, Response, NextFunction } from "express";
export type Options = {
  name: string;
  choice: string;
  additionalPrice?: number;
};
interface AddToCartRequestBody {
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
  note?: string;
  options?: Options[];
}
class CartController {
  cartService: CartService;
  constructor() {
    this.cartService = new CartService();
  }
  getCart = async (req: Request, res: Response, next: NextFunction) => {};
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { menuItemId, menuItemName, menuItemPrice, note, options } =
        req.body as AddToCartRequestBody;
      const userId = req.user?.id as string;
      const cart = await addToCart(
        userId,
        menuItemId,
        menuItemName,
        menuItemPrice,
        note ? note : "",
        options ? options : []
      );
      res.status(201).json({
        message: MESSAGES.ITEM_ADDED_TO_CART,
        data: cart,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  updateCartQuantity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id as string;
    const { cartItemId, quantity } = req.body;
    try {
      const updatedCartItem = await updateCartQuantity(
        userId,
        cartItemId,
        quantity
      );
      res.status(200).json({
        message: MESSAGES.CART_ITEM_QUANTITY_UPDATED,
        data: updatedCartItem,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      const { cartItemId } = req.body;
      const result = await removeFromCart(userId, cartItemId);
      res.status(200).json({
        message: MESSAGES.ITEM_REMOVED_FROM_CART,
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default CartController;
