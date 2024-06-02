const generateRandomOTP = () => {
  const min = 100000;
  const max = 999900;
  const randomOTP = Math.floor(Math.random() * (max - min + 1) + min);
  return randomOTP.toString();
};
export default generateRandomOTP;
