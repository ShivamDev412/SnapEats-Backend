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
          status: 'PENDING',
        },
      });
      return newOrder;
    } catch (error) {
      throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
    }
  };
export { createOrder };
