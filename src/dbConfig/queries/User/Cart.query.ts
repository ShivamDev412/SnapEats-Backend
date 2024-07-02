import { InternalServerError } from "../../../utils/Error";
import { Options } from "../../../controllers/User/Cart.controller";
import prisma from "../../../dbConfig";

const addToCart = async (
  userId: string,
  menuItemId: string,
  menuItemName: string,
  menuItemPrice: number,
  note: string,
  options: Options[]
) => {
  try {
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: {
        userId,
        items: {
          create: {
            menuItemId,
            name: menuItemName,
            price: menuItemPrice,
            quantity: 1,
            note,
            options: {
              create: options?.map((option) => ({
                name: option.name,
                choice: option.choice,
                additionalPrice: option.additionalPrice,
              })),
            },
          },
        },
      },
      update: {
        items: {
          create: {
            menuItemId,
            name: menuItemName,
            price: menuItemPrice,
            quantity: 1,
            note,
            options: {
              create: options?.map((option) => ({
                name: option.name,
                choice: option.choice,
                additionalPrice: option.additionalPrice,
              })),
            },
          },
        },
      },
    });

    return cart;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const updateCartQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  try {
    const updatedCartItem = await prisma.cartItem.updateMany({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
      data: {
        quantity,
      },
    });

    return updatedCartItem;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const removeFromCart = async (userId: string, cartItemId: string) => {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
    });

    return { message: "Item removed from cart successfully" };
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
export { addToCart, updateCartQuantity, removeFromCart };
