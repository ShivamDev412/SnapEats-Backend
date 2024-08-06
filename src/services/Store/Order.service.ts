import Stripe from "stripe";
import { InternalServerError } from "../../utils/Error";
import { getOrderById } from "../../dbConfig/queries/User/Order.query";
import {
  updateOrderStatus,
  getOrdersByStoreId,
  updateOrderApplicationFeeAndTime,
} from "../../dbConfig/queries/Store/Order.query";
import { MESSAGES, ORDER_STATUS, SOCKET_EVENT } from "../../utils/Constant";
import { io } from "../../index";
import { getImage } from "../../utils/UploadToS3";
import { CancelOrderNotificationTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";
import { getStoreAddressCoordinates } from "../../dbConfig/queries/Store/Store.query";
import moment from "moment";
import handleOrderStatusDetails from "../../utils/HandleOrderStatusDetails";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class OrderService {
  async getOrder(storeId: string, page: number) {
    const { orders, totalCount } = await getOrdersByStoreId(storeId, page);
    const ordersToSend = await Promise.all(
      orders.map(async (order) => {
        const itemsWithImages = await Promise.all(
          order.items.map(async (item) => {
            const image = await getImage(item.menuItem.image as string);
            const compressedImage = await getImage(
              item.menuItem.compressedImage as string
            );
            return {
              ...item,
              menuItem: {
                image,
                compressedImage,
              },
            };
          })
        );
        return {
          ...order,
          items: itemsWithImages,
        };
      })
    );
    return {
      orders: ordersToSend,
      totalCount,
    };
  }

  async acceptOrder(orderId: string) {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new InternalServerError(MESSAGES.ORDER_NOT_FOUND);
    }
    const applicationFee = order.totalAmount * 0.05;
    const updatedOrder = await updateOrderStatus(order.id, ORDER_STATUS[0]);
    const { deliveryAddress, store, acceptedAt, items } = updatedOrder;
    const { minTime, maxTime } = handleOrderStatusDetails(
      deliveryAddress?.lat as number,
      deliveryAddress?.lon as number,
      store.address?.lat as number,
      store.address?.lon as number,
      items as { menuItem: { prepTime: number } }[],
      moment(acceptedAt)
    );
    await updateOrderApplicationFeeAndTime(
      order.id,
      applicationFee,
      minTime,
      maxTime
    );
    io.emit(SOCKET_EVENT.ORDER_STATUS, {
      orderId: order.id,
      storeName: order.store.name,
      estimatedDeliveryTime: {
        minTime: minTime,
        maxTime: maxTime,
      },
      status: ORDER_STATUS[0],
    });
    setTimeout(async () => {
      try {
        await updateOrderStatus(order.id, ORDER_STATUS[1]);
        io.emit(SOCKET_EVENT.ORDER_STATUS, {
          orderId: order.id,
          storeName: order.store.name,
          estimatedDeliveryTime: {
            minTime: minTime,
            maxTime: maxTime,
          },
          status: ORDER_STATUS[1],
        });
      } catch (error) {
        throw new InternalServerError(MESSAGES.UNEXPECTED_ERROR);
      }
    }, 20000);
    return order;
  }

  async cancelOrder(orderId: string) {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new InternalServerError(MESSAGES.ORDER_NOT_FOUND);
    }

    await updateOrderStatus(order.id, ORDER_STATUS[2]);
    const htmlTemplate = CancelOrderNotificationTemplate(
      order.user.name,
      order.id
    );
    await sendToMail(
      order.user.email,
      MESSAGES.CANCELLED_ORDER_SUBJECT,
      htmlTemplate,
      order.store.name,
      order.store.email
    );
    io.to(order.storeId).emit(SOCKET_EVENT.ORDER_STATUS, {
      orderId: order.id,
      status: ORDER_STATUS[2],
    });

    return order;
  }
}

export default OrderService;
