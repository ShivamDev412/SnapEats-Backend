import prisma from "../../../dbConfig";
import { InternalServerError } from "../../../utils/Error";
import { MESSAGES } from "../../../utils/Constant";
import { OrderSummaryItem } from "../../../services/User/Checkout.Service";

const createOrder = async (
  userId: string,
  amount: number,
  storeId: string,
  defaultAddressId: string,
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
        acceptedAt: new Date(),
        deliveryAddressId: defaultAddressId,
        status: "PENDING",
      },
      
    });
    return newOrder;
  } catch (error) {
    console.error(error);
    throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
  }
};
const getOrders = async (userId: string, page: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        items: {
          select: {
            id: true,
            name: true,
            menuItem: {
              select: {
                image: true,
                compressedImage: true,
              },
            },
            quantity: true,
            options: true,
            menuItemId: true,
            note: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * 10,
      take: 10,
    });
    const totalCount = await prisma.order.count({
      where: {
        userId,
      },
    });
    return {
      orders,
      totalCount,
    };
  } catch (error) {
    throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
  }
};
const getOrderDetailById = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      totalAmount: true,
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          options: true,
          menuItemId: true,
          note: true,
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
          email: true,
          id: true,
          deliveryFee: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
    },
  });
};
const getOrdersStatus = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      userId,
      OR: [
        { status: "ACCEPTED" },
        { status: "PREPARING" },
        { status: "READY" },
        { status: "OUT_FOR_DELIVERY" },
      ],
    },
    select: {
      maxTime: true,
      minTime: true,
      id: true,
      status: true,
      deliveryAddress: {
        select: {
          lat: true,
          lon: true,
        },
      },
      items: {
        include: {
          menuItem: {
            select: {
              prepTime: true,
            },
          },
        },
      },
      acceptedAt: true,
      store: {
        select: {
          name: true,
          id: true,
        },
      },
      createdAt: true,
    },
  });
};

export {
  createOrder,
  getOrderById,
  getOrderDetailById,
  getOrders,
  getOrdersStatus,
};
