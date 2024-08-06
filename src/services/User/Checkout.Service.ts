import {
  clearCart,
  getCartWithStore,
} from "../../dbConfig/queries/User/Cart.query";
import { getUserStripeCustomerId } from "../../dbConfig/queries/User/User.query";
import { InternalServerError } from "../../utils/Error";
import { MESSAGES, SOCKET_EVENT, TAX } from "../../utils/Constant";
import {
  createOrder,
  getOrderDetailById,
} from "../../dbConfig/queries/User/Order.query";
import { io } from "../../index";

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
  gst: number;
  pst: number;
};

type StoreSummary = {
  storeId: string;
  storeName: string;
  stripeAccountId: string;
  deliveryFee: number;
  items: OrderSummaryItem[];
  subtotal: number;
  gst: number;
  pst: number;
  totalWithTax: number;
};
class CheckoutService {
  async getOrderSummary(userId: string) {
    const cartItems = await getCartWithStore(userId);
    const calculateTax = (amount: number, rate: number) => amount * rate;
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
          gst: 0,
          pst: 0,
          totalWithTax: 0,
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
        id: item.menuItemId,
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
        gst: 0,
        pst: 0,
      });
      summary[store.id].subtotal += itemTotalPrice;
      return summary;
    }, {} as { [key: string]: StoreSummary });

    const orderSummary = Object.values(storeSummary).map((store) => {
      return {
        ...store,
        gst: calculateTax(store.subtotal, TAX.GST_RATE),
        pst: calculateTax(store.subtotal, TAX.PST_RATE),
        totalWithTax:
          calculateTax(store.subtotal, TAX.GST_RATE) +
          calculateTax(store.subtotal, TAX.PST_RATE) +
          store.subtotal +
          store.deliveryFee,
      };
    });
    const grandTotal =
      orderSummary.reduce((total, store) => {
        return total + store.totalWithTax;
      }, 0) || 0;

    return {
      orderSummary,
      grandTotal,
      gstRate: TAX.GST_RATE,
      pstRate: TAX.PST_RATE,
    };
  }
  async placeOrder(userId: string, orderItems: StoreSummary[]) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    if(!user.defaultAddressId) {
      throw new InternalServerError(MESSAGES.NO_DEFAULT_ADDRESS);
    }
    const orders = await Promise.all(
      orderItems.map(async (store) => {
        const storeId = store.storeId;
        const storeOrder = await createOrder(
          userId,
          store.totalWithTax,
          storeId,
          user?.defaultAddressId as string,
          store.items
        );
        const orderToSend = await getOrderDetailById(storeOrder.id);
        await clearCart(userId);
        io.emit(SOCKET_EVENT.NEW_ORDER, orderToSend);
        return storeOrder;
      })
    );

    return orders;
  }
}
export default CheckoutService;
