import { InternalServerError } from "../../../utils/Error";
import prisma from "../../../dbConfig";

const getCart = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            options: true,
          },
        },
      },
    });

    return cart;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const addToCart = async (
  userId: string,
  menuItemId: string,
  menuItemName: string,
  menuItemPrice: number,
  note: string,
  options?: {
    optionId: string;
    optionName: string;
    choiceId?: string;
    choiceName: string;
    additionalPrice: number;
  }[]
) => {
  try {
    const cart = await prisma.cart.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId,
        items: {
          create: [
            {
              menuItemId,
              name: menuItemName,
              price: menuItemPrice,
              quantity: 1,
              note,
              options: {
                create: options?.map((option) => ({
                  optionId: option.optionId,
                  optionName: option.optionName,
                  choiceId: option.choiceId || null,
                  choiceName: option.choiceName,
                  additionalPrice: option.additionalPrice,
                })),
              },
            },
          ],
        },
      },
      update: {
        items: {
          create: [
            {
              menuItemId,
              name: menuItemName,
              price: menuItemPrice,
              quantity: 1,
              note,
              options: {
                create: options?.map((option) => ({
                  optionId: option.optionId,
                  optionName: option.optionName,
                  choiceId: option.choiceId || null,
                  choiceName: option.choiceName,
                  additionalPrice: option.additionalPrice,
                })),
              },
            },
          ],
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
    const deletedCartItem = await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
    });
    return deletedCartItem;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

export { addToCart, updateCartQuantity, removeFromCart, getCart };
