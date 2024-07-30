import Stripe from "stripe";
import { InternalServerError } from "../../utils/Error";
import { getOrderById } from "../../dbConfig/queries/User/Order.query";
import {
  acceptOrder,
  cancelOrder,
  getOrdersByStoreId,
} from "../../dbConfig/queries/Store/Order.query";
import { CURRENCY, MESSAGES, SOCKET_EVENT } from "../../utils/Constant";
import { io } from "../../index";
import { getImage } from "../../utils/UploadToS3";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,);

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

    const user = order.user;
    const store = order.store;
    // Check if user has a default payment method
    if (!user.paymentMethodId) {
      throw new InternalServerError(MESSAGES.PAYMENT_METHOD_NOT_SET);
    }
    if (!store) {
      throw new InternalServerError(MESSAGES.STORE_NOT_FOUND);
    }

    // Ensure the store's Stripe account has the necessary capabilities
    const storeAccount =
      store?.stripeAccountId &&
      (await stripe.accounts.retrieve(store?.stripeAccountId));
    if (!storeAccount) {
      throw new InternalServerError(MESSAGES.STRIPE_ACCOUNT_NOT_FOUND);
    }
    console.log(storeAccount.capabilities, "storeAccount.capabilities");
    if (
      !storeAccount.capabilities?.transfers ||
      storeAccount.capabilities.transfers !== "active"
    ) {
      throw new InternalServerError(
        MESSAGES.STRIPE_ACCOUNT_CAPABILITIES_NOT_MET
      );
    }

    const amount = order.totalAmount;

    // Calculate platform fee (15%) and total store amounts
    const platformFee = Math.floor(amount * 0.15);
    const storeAmount = amount - platformFee;

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: CURRENCY.CAD,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      customer: user.stripeCustomerId as string,
      payment_method: user.paymentMethodId as string,
      confirm: true,
      metadata: {
        userId: user.id,
        orderId: order.id,
      },
    });

    if (!paymentIntent) {
      throw new InternalServerError(MESSAGES.PAYMENT_FAILED);
    }

    const chargeId = paymentIntent.latest_charge as string;

    // Create Transfer for the store
    const transfer = await stripe.transfers.create({
      amount: Math.round(storeAmount * 100),
      currency: CURRENCY.CAD,
      destination: store.stripeAccountId as string,
      source_transaction: chargeId,
      metadata: {
        orderId: order.id,
      },
    });

    if (!transfer) {
      throw new InternalServerError(MESSAGES.TRANSFER_FAILED);
    }

    await acceptOrder(order.id);
    io.to(order.storeId).emit(SOCKET_EVENT.ORDER_STATUS, {
      ...order,
      status: "ACCEPTED",
    });
    return order;
  }

  async cancelOrder(orderId: string) {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new InternalServerError(MESSAGES.ORDER_NOT_FOUND);
    }

    await cancelOrder(order.id);
    io.to(order.storeId).emit(SOCKET_EVENT.ORDER_STATUS, {
      ...order,
      status: "CANCELLED",
    });

    return order;
  }
}

export default OrderService;
