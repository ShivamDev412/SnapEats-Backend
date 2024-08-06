import { MenuItem } from "@prisma/client";
import calculateDistance from "./GetDistance";
import getTravelTime from "./TravelTime";
import moment from "moment-timezone";

const handleOrderStatusDetails = (
  lat: number,
  lon: number,
  destLat: number,
  destLon: number,
  orderItems: { menuItem: { prepTime: number } }[],
  acceptedAt: moment.Moment
) => {
  const distance = calculateDistance(lat, lon, destLat, destLon);
  const cookingTime = orderItems.reduce((acc, item) => {
    return acc + item.menuItem.prepTime;
  }, 0);
  const { min: minTravelTime, max: maxTravelTime } = getTravelTime(
    cookingTime,
    distance
  );
  const minTime = acceptedAt
    .clone()
    .add(minTravelTime, "minutes")
    .toISOString();
  const maxTime = acceptedAt
    .clone()
    .add(maxTravelTime, "minutes")
    .toISOString();
  return {
    minTime,
    maxTime,
  };
};
export default handleOrderStatusDetails;
