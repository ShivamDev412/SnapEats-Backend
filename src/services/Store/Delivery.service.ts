import { io } from "../../index";
import { updateOrderStatus } from "../../dbConfig/queries/Store/Order.query";
import { ORDER_STATUS, SOCKET_EVENT } from "../../utils/Constant";
import { getOrderById } from "../../dbConfig/queries/User/Order.query";
import calculateDistance from "../../utils/GetDistance";
import getTravelTime from "../../utils/TravelTime";

class DeliveryService {
  async outForDelivery(orderId: string) {
    const order = await getOrderById(orderId);
    const updatedOrder = await updateOrderStatus(orderId, ORDER_STATUS[4]);
    io.emit(SOCKET_EVENT.ORDER_STATUS, {
      orderId: order?.id,
      storeName: order?.store.name,
      // estimatedDeliveryTime: {
      //   minTime: order?.minTime,
      //   maxTime: order?.maxTime,
      // },
      status: ORDER_STATUS[4],
    });
    const distance = calculateDistance(
      updatedOrder?.deliveryAddress?.lat as number,
      updatedOrder?.deliveryAddress?.lon as number,
      updatedOrder?.store.address?.lat as number,
      updatedOrder?.store.address?.lon as number
    );
    const cookingTime = updatedOrder.items.reduce((acc, item) => {
      return acc + item.menuItem.prepTime;
    }, 0);
    const { min: minTravelTime, max: maxTravelTime } = getTravelTime(
      cookingTime,
      distance
    );
    const avgTime = (minTravelTime + maxTravelTime) / 2;
    const deliveryTime = avgTime * 1000;
    setTimeout(async () => {
      await updateOrderStatus(orderId, ORDER_STATUS[5]);
      io.emit(SOCKET_EVENT.ORDER_STATUS, {
        orderId: order?.id,
        storeName: order?.store.name,
        // estimatedDeliveryTime: {
        //   minTime: order?.minTime,
        //   maxTime: order?.maxTime,
        // },
        status: ORDER_STATUS[5],
      });
    }, 15000);
  }
}
export default DeliveryService;
