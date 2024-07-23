import { InternalServerError } from "../../../utils/Error";
import prisma from "../../../dbConfig";
import { MESSAGES } from "../../../utils/Constant";
import { OrderSummaryItem } from "../../../services/User/Checkout.Service";

const createOrder = async (
  userId: string,
  amount: number,
  storeId: string,
  orderItems: OrderSummaryItem[]
) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        totalAmount: amount,
        items: {
          create: orderItems.map((item) => ({
            menuItemId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: {
              create: item.options.map((option) => ({
                name: option.optionName,
                choice: option.choiceName,
                additionalPrice: option.additionalPrice,
              })),
            },
          })),
        },
        status: "PENDING",
      },
    });
    return newOrder;
  } catch (error) {
    throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
  }
};
const getOrdersByUserId = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          menuItem: true,
          options: true,
        },
      },
    },
  });
};
const getOrderById = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          menuItem: true,
          options: true,
        },
      },
      store: {
        select: {
          name: true,
          id: true,
          deliveryFee: true,
          stripeAccountId: true,
        },
      },
      user: {
        select: {
          name: true,
          id: true,
          addresses: true,
          paymentMethodId: true,
          stripeCustomerId: true,
        },
      },
    },
  });
};
const acceptOrder = async (orderId: string) => {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
};
const cancelOrder = async (orderId: string) => {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELED",
    },
  });
}
export { createOrder, getOrderById, acceptOrder, cancelOrder };
