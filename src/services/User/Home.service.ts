import calculateDistance from "../../utils/GetDistance";
import {
  getAllStores,
  getStoreHomeById,
} from "../../dbConfig/queries/Store.query";
import { getImage } from "../../utils/UploadToS3";
import { DISTANCE_LIMIT, specialEventDates } from "../../utils/Constant";
import moment from "moment";
import { NotFoundError } from "../../utils/Error";
import getTravelTime from "../../utils/TravelTime";
class HomeService {
  async getStores(
    lat: number,
    lon: number,
    search: String,
    foodTypeId: string
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
    if (foodTypeId) {
      filteredStores = filteredStores.filter((store) =>
        store.foodTypes.map((type) => type.foodType).includes(foodTypeId)
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
            : store.openTime,
          closeTime: isSpecialEventDate(moment())
            ? store.specialEventCloseTime
            : store.closeTime,
          name: store.name,
          id: store.id,
          travelTime: store.travelTime,
          deliveryFee: store.deliveryFee,
          rating: store.rating,
          image: await getImage(store.image as string),
          compressedImage: await getImage(store.compressedImage as string),
        };
      })
    );
    return dataToSend;
  }
  async getStoreDetails(storeId: string, lat: number, lon: number) {
    const store = await getStoreHomeById(storeId);
    if (!store) throw new NotFoundError("Store not found");
    const storeImage = await getImage(store?.image as string);
    const storeCompressedImage = await getImage(
      store?.compressedImage as string
    );
    const distance = calculateDistance(
      lat,
      lon,
      store?.address?.lat as number,
      store.address?.lon as number
    );
    const foodAverageCookTime =
      store.menuItems.reduce((acc, type) => {
        return acc + type.prepTime;
      }, 0) / store.menuItems.length;
    const isSpecialEventDate = (date: moment.Moment): boolean => {
      const formattedDate = date.format("YYYY-MM-DD");
      return specialEventDates.includes(formattedDate);
    };
    const travelTime = getTravelTime(foodAverageCookTime, distance);
    const menuItems = await Promise.all(
      store.menuItems.map(async (item) => {
        const itemImage = await getImage(item.image as string);
        const itemCompressedImage = await getImage(
          item.compressedImage as string
        );
        return {
          ...item,
          image: itemImage,
          compressedImage: itemCompressedImage,
        };
      })
    );
    return {
      ...store,
      image: storeImage,
      compressedImage: storeCompressedImage,
      menuItems,
      address: store.address?.address,
      deliveryFee: distance < 3 ? 0 : distance * 0.5,
      travelTime,
      openTime: isSpecialEventDate(moment())
        ? store.specialEventOpenTime
        : store.openTime,
      closeTime: isSpecialEventDate(moment())
        ? store.specialEventCloseTime
        : store.closeTime,
    };
  }
}
export default HomeService;
