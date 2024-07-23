import { getCartWithStore } from "../../dbConfig/queries/User/Cart.query";
import { getUserStripeCustomerId } from "../../dbConfig/queries/User.query";
import { InternalServerError } from "../../utils/Error";
import { MESSAGES, SOCKET_EVENT } from "../../utils/Constant";
import { createOrder } from "../../dbConfig/queries/User/Order.query";
import { io } from "../../utils/SocketInstance";

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
  stripeAccountId: string;
  deliveryFee: number;
  items: OrderSummaryItem[];
  subtotal: number;
};
class CheckoutService {
  async getOrderSummary(userId: string) {
    const cartItems = await getCartWithStore(userId);
    const storeSummary = cartItems.reduce((summary, item) => {
      const { store } = item.menuItem;
      if (!summary[store.id]) {
        summary[store.id] = {
          storeId: store.id,
          stripeAccountId: store.stripeAccountId || "",
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
  async placeOrder(userId: string, orderItems: StoreSummary[]) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    const storeOrderPromises = orderItems.map(async (store) => {
      const storeId = store.storeId;
      const storeOrder = await createOrder(
        userId,
        store.subtotal + store.deliveryFee,
        storeId,
        store.items
      );
      io.emit(SOCKET_EVENT.NEW_ORDER, storeOrder);

      return storeOrder;
    });

    const orders = await Promise.all(storeOrderPromises);

    return orders;
  }
}
export default CheckoutService;
