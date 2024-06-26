import calculateDistance from "../../utils/GetDistance";
import { getAllStores } from "../../dbConfig/queries/Store.query";
import { getImage } from "../../utils/UploadToS3";
import {
  AVERAGE_SPEED_MPH,
  DISTANCE_LIMIT,
  EXTRA_MINUTE,
  specialEventDates,
} from "../../utils/Constant";
import moment from "moment";

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
        const foodAverageTime =
          store.menuItems.reduce((acc, type) => {
            return acc + type.prepTime;
          }, 0) / store.menuItems.length;

        const travelTime =
          (distance / AVERAGE_SPEED_MPH) * 60 + foodAverageTime;
        return {
          ...store,
          rating,
          deliveryFee: distance < 3 ? 0 : distance * 0.5,
          travelTime: {
            min: Math.floor(travelTime - EXTRA_MINUTE),
            max: Math.floor(
              travelTime +
                (distance < 5
                  ? 0
                  : distance >= 5
                  ? EXTRA_MINUTE
                  : distance > 5 && distance <= 15
                  ? EXTRA_MINUTE * 2
                  : EXTRA_MINUTE * 3)
            ),
          },
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
}
export default HomeService;
