import prisma from "../../../dbConfig";

const updateOrderStatusToOutForDelivery = async (orderId: string) => {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "OUT_FOR_DELIVERY",
    },
  });
};
export { updateOrderStatusToOutForDelivery };
