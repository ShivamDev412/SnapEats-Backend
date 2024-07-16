import Stripe from "stripe";
import { getCartWithStore } from "../../dbConfig/queries/User/Cart.query";
import { getUserStripeCustomerId } from "../../dbConfig/queries/User.query";
import { InternalServerError } from "../../utils/Error";
import { CURRENCY, MESSAGES } from "../../utils/Constant";
import { createOrder } from "../../dbConfig/queries/User/Order.query";
export type OrderSummaryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options: {
    id: string;
    optionName: string;
    choiceName: string;
    additionalPrice?: number;
  }[];
  totalPrice: number;
};

type StoreSummary = {
  storeId: string;
  storeName: string;
  deliveryFee: number;
  items: OrderSummaryItem[];
  subtotal: number;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
class CheckoutService {
  async getOrderSummary(userId: string) {
    const cartItems = await getCartWithStore(userId);
    const storeSummary = cartItems.reduce((summary, item) => {
      const { store } = item.menuItem;
      if (!summary[store.id]) {
        summary[store.id] = {
          storeId: store.id,
          storeName: store.name,
          deliveryFee: store.deliveryFee || 0,
          items: [],
          subtotal: 0,
        };
      }
      const itemTotalPrice =
        (item.price +
          item.options.reduce(
            (acc, option) => acc + (option.additionalPrice || 0),
            0
          )) *
        item.quantity;
      summary[store.id].items.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options.map((option) => ({
          id: option.id,
          optionName: option.optionName || "",
          choiceName: option.choiceName || "",
          additionalPrice: option.additionalPrice || 0,
        })),
        totalPrice: itemTotalPrice,
      });
      summary[store.id].subtotal += itemTotalPrice;
      return summary;
    }, {} as { [key: string]: StoreSummary });
    const orderSummary = Object.values(storeSummary);
    return orderSummary;
  }
  async processOrder(
    userId: string,
    amount: number,
    orderItems: StoreSummary[]
  ) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }

    // Make Payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: CURRENCY.CAD,
      customer: user.stripeCustomerId as string,
      payment_method: user.paymentMethodId as string,
      metadata: {
        userId,
        orderItems: JSON.stringify(orderItems),
      },
    });

    // Iterate over the orderItems to create an order for each store
    const storeOrderPromises = orderItems.map(async (store) => {
      const storeId = store.storeId;
      const storeOrder = await createOrder(
        userId,
        store.subtotal + store.deliveryFee,
        storeId,
        store.items
      );
      return storeOrder;
    });

    const orders = await Promise.all(storeOrderPromises);

    // Clear Cart

    // Notify Store about order
    // Notify User that order has been placed

    return orders;
  }
}
export default CheckoutService;
