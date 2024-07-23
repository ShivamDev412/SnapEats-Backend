import { InternalServerError } from "../../../utils/Error";
import prisma from "../../../dbConfig";
import { MESSAGES } from "../../../utils/Constant";

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
          orderBy: {
            createdAt: 'desc', 
          },
        },
      },
    });

    return cart;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getCartWithStore = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                store: {
                  select:{
                    id: true,
                    name: true,
                    deliveryFee: true,
                    stripeAccountId: true,
                  }
                },
              },
            },
            options: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart.items
  } catch (error: any) {
    throw new Error(error.message);
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
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId,
        },
      },
    });

    if (!cartItem) {
      throw new InternalServerError(MESSAGES.CART_NOT_FOUND);
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
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
    await prisma.cartItemOption.deleteMany({
      where: {
        cartItemId: cartItemId,
      },
    });

    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return deletedCartItem;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const addNoteToItem = async (cartItemId:string, note:string) => {
  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        note,
      },
    });

    return updatedCartItem;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const clearCart = async (userId: string) => {
  try {
    const deletedCartItems = await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: userId,
        },
      },
    });

    return deletedCartItems;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
export { addToCart, updateCartQuantity, removeFromCart, getCart, addNoteToItem, getCartWithStore, clearCart };
