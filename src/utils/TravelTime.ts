import { AVERAGE_SPEED_MPH, EXTRA_MINUTE } from "./Constant";
const getTravelTime = (foodAverageCookTime: number, distance: number) => {
  const travelTime = (distance / AVERAGE_SPEED_MPH) * 60 + foodAverageCookTime;
  return {
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
  };
};
export default getTravelTime;
