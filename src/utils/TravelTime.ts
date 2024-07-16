import { AVERAGE_SPEED_MPH, EXTRA_MINUTE, MIN_TIME } from "./Constant";

const getTravelTime = (foodAverageCookTime: number, distance: number) => {
  const travelTime = (distance / AVERAGE_SPEED_MPH) * 60 + foodAverageCookTime;

  const minTime = Math.max(Math.floor(travelTime + EXTRA_MINUTE), MIN_TIME);

  const extraTime =
    distance < 5
      ? 0
      : distance >= 5 && distance <= 15
      ? EXTRA_MINUTE * 2
      : EXTRA_MINUTE * 3;

  const maxTime = Math.floor(travelTime + extraTime) + MIN_TIME;

  return {
    min: minTime,
    max: maxTime,
  };
};

export default getTravelTime;
