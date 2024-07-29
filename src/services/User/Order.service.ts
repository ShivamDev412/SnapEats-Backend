import { NotFoundError } from "../../utils/Error";
import { getOrders } from "../../dbConfig/queries/User/Order.query";
import { MESSAGES } from "../../utils/Constant";
import { getImage } from "../../utils/UploadToS3";

class OrderService {
  getOrders = async (userId: string, page: number) => {
    if (!userId) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const { orders, totalCount } = await getOrders(userId, page);
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
  };
}
export default OrderService;
