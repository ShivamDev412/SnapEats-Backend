import calculateDistance from "../../utils/GetDistance";
import {
  getAllStores,
  getStorePrimaryDetails,
} from "../../dbConfig/queries/Store/Store.query";
import { getStoreMenuItems } from "../../dbConfig/queries/Store/Menu.query";
import { getImage } from "../../utils/UploadToS3";
import {
  defaultCloseTime,
  defaultOpenTime,
  DISTANCE_LIMIT,
  specialEventDates,
} from "../../utils/Constant";
import moment from "moment";
import { InternalServerError, NotFoundError } from "../../utils/Error";
import getTravelTime from "../../utils/TravelTime";
import { getCartByUserId } from "../../dbConfig/queries/User/Cart.query";
interface CartItem {
  menuItemId: string;
  quantity: number;
}
class HomeService {
  async getStores(
    lat: number,
    lon: number,
    search: String,
    foodType: string
  ) {
    const getAllStore = await getAllStores();
    let filteredStores = getAllStore
      .filter((store) => {
        const distance = calculateDistance(
          lat,
          lon,
          store?.address?.lat as number,
          store.address?.lon as number
        );
        return distance <= DISTANCE_LIMIT;
      })
      .map((store) => {
        const distance = calculateDistance(
          lat,
          lon,
          store?.address?.lat as number,
          store.address?.lon as number
        );
        const rating = store.reviews.length
          ? store.reviews?.reduce((acc, review) => acc + review.rating, 0) /
            store.reviews?.length
          : 0;
        const foodAverageCookTime =
          store.menuItems.reduce((acc, type) => {
            return acc + type.prepTime;
          }, 0) / store.menuItems.length;

        const travelTime = getTravelTime(foodAverageCookTime, distance);
        return {
          ...store,
          rating,
          deliveryFee: distance < 3 ? 0 : distance * 0.5,
          travelTime,
        };
      });
    if (search) {
      filteredStores = filteredStores.filter((store) =>
        store.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (foodType) {
      console.log(filteredStores[2].foodTypes);
      filteredStores = filteredStores.filter((store) =>
        store.foodTypes.map((type) => type.foodType).includes(foodType)
      );
    }
    const isSpecialEventDate = (date: moment.Moment): boolean => {
      const formattedDate = date.format("YYYY-MM-DD");
      return specialEventDates.includes(formattedDate);
    };
    const dataToSend = await Promise.all(
      filteredStores.map(async (store) => {
        return {
          openTime: isSpecialEventDate(moment())
            ? store.specialEventOpenTime
            : store.openTime !== null
            ? store.openTime
            : defaultOpenTime,
          closeTime: isSpecialEventDate(moment())
            ? store.specialEventCloseTime
            : store.closeTime !== null
            ? store.closeTime
            : defaultCloseTime,
          name: store.name,
          id: store.id,
          travelTime: store.travelTime,
          deliveryFee: store.deliveryFee,
          rating: store.rating,
          image: store.image ? await getImage(store.image as string) : "",
          compressedImage: store.compressedImage
            ? await getImage(store.compressedImage as string)
            : "",
        };
      })
    );
    return dataToSend;
  }
  async getStorePrimaryDetails(storeId: string, lat: number, lon: number) {
    try {
      const store = await getStorePrimaryDetails(storeId);
      const { averagePrepTime } = await getStoreMenuItems(storeId);

      if (!store) throw new NotFoundError("Store not found");
      const storeImage = store?.image
        ? await getImage(store?.image as string)
        : "";
      const storeCompressedImage = store.compressedImage
        ? await getImage(store?.compressedImage as string)
        : "";
      const distance = calculateDistance(
        lat,
        lon,
        store?.address?.lat as number,
        store.address?.lon as number
      );
      const isSpecialEventDate = (date: moment.Moment): boolean => {
        const formattedDate = date.format("YYYY-MM-DD");
        return specialEventDates.includes(formattedDate);
      };
      const travelTime = getTravelTime(averagePrepTime, distance);
      return {
        ...store,
        image: storeImage,
        compressedImage: storeCompressedImage,
        address: store.address?.address,
        deliveryFee: distance < 3 ? 0 : distance * 0.5,
        travelTime,
        openTime: isSpecialEventDate(moment())
          ? store.specialEventOpenTime
          : store.openTime !== null
          ? store.openTime
          : defaultOpenTime,
        closeTime: isSpecialEventDate(moment())
          ? store.specialEventCloseTime
          : store.closeTime !== null
          ? store.closeTime
          : defaultCloseTime,
      };
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async getStoreMenuItems(storeId: string, userId: string) {
    const cart = await getCartByUserId(userId);
    const { menuItems } = await getStoreMenuItems(storeId);
    const cartItemsMap: { [key: string]: number } =
      cart?.items.reduce(
        (map: { [key: string]: number }, cartItem: CartItem) => {
          map[cartItem.menuItemId] = cartItem.quantity;
          return map;
        },
        {}
      ) || {};
    const menuItemsData = await Promise.all(
      menuItems.map(async (item) => {
        const itemImage = await getImage(item.image as string);
        const itemCompressedImage = await getImage(
          item.compressedImage as string
        );
        return {
          ...item,
          image: itemImage,
          compressedImage: itemCompressedImage,
          quantity: cartItemsMap[item.id] || 0,
        };
      })
    );
    return menuItemsData;
  }
}
export default HomeService;
