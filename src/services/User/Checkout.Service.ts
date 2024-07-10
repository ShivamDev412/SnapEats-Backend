import { getCartWithStore } from "../../dbConfig/queries/User/Cart.query";
type OrderSummaryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options: {
    id: string;
    optionName: string;
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
}
export default CheckoutService;
