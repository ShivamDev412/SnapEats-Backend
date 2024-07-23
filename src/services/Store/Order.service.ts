import Stripe from "stripe";
import { InternalServerError } from "../../utils/Error";
import {
  acceptOrder,
  cancelOrder,
  getOrderById,
} from "../../dbConfig/queries/User/Order.query";
import { CURRENCY, MESSAGES, SOCKET_EVENT } from "../../utils/Constant";
import { io } from "../../utils/SocketInstance";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
class OrderService {
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

    const amount = order.totalAmount;

    // Calculate platform fee (15%) and total store amounts
    const platformFee = Math.floor(amount * 0.15);
    const storeAmount = amount - platformFee;

    // Create the PaymentIntent without transfer_data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: CURRENCY.CAD,
      customer: user.stripeCustomerId as string,
      payment_method: user.paymentMethodId as string,
      confirm: true,
      metadata: {
        userId: user.id,
        orderId: order.id,
      },
    });

    // Create Transfer for the store
    await stripe.transfers.create({
      amount: storeAmount * 100,
      currency: CURRENCY.CAD,
      destination: store.stripeAccountId as string,
      source_transaction: paymentIntent.id,
      metadata: {
        orderId: order.id,
      },
    });
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
