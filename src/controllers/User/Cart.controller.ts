import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import {
  addNoteToItem,
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../../dbConfig/queries/User/Cart.query";
import { Request, Response, NextFunction } from "express";

export type Options = {
  optionId: string;
  optionName: string;
  choiceId?: string;
  choiceName: string;
  additionalPrice: number;
};

interface AddToCartRequestBody {
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
  note?: string;
  options?: Options[];
}

class CartController {
  constructor() {}

  getCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const cart = await getCart(userId);
    res.status(200).json({
      message: MESSAGES.CART_FETCHED,
      data: cart?.items,
      success: true,
    });
  };

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
        note || "",
        options || []
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
      res.status(STATUS_CODE.OK).json({
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
      await removeFromCart(userId, cartItemId);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.ITEM_REMOVED_FROM_CART,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  addNoteToItem = async (req: Request, res: Response, next: NextFunction) => {
    const { cartItemId, note } = req.body;
    try {
      await addNoteToItem(cartItemId, note);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.CART_ITEM_NOTE_UPDATED,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
