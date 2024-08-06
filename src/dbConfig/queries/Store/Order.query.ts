import { MESSAGES } from "../../../utils/Constant";
import prisma from "../../../dbConfig";
import { InternalServerError } from "../../../utils/Error";
import { OrderStatus } from "@prisma/client";
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const data =
    status === OrderStatus.ACCEPTED
      ? { acceptedAt: new Date(), status }
      : { status };
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data,
    select: {
      acceptedAt: true,
      deliveryAddress: true,
      store: {
        include: {
          address: {
            select: {
              lat: true,
              lon: true,
            },
          },
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
    },
  });
};

const getOrdersByStoreId = async (storeId: string, page: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        storeId,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
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
        user: {
          select: {
            id: true,
            name: true,
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
        storeId,
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

const updateOrderApplicationFeeAndTime = async (
  orderId: string,
  applicationFee: number,
  minTime:string,
  maxTime:string
) => {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      applicationFee,
      minTime,
      maxTime,
    },
  });
};
export { updateOrderStatus, getOrdersByStoreId, updateOrderApplicationFeeAndTime };
