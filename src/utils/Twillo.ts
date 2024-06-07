import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sentOTP = async (verificationOTP: string, phoneNo: string) => {
  const message = await client.messages.create({
    body: `Your OTP for verification is ${verificationOTP}`,
    from: process.env.TWILIO_ACCOUNT_PHONE_NUMBER,
    to: phoneNo.replace(/\s/g, ""),
  });
  return message;
};
export default sentOTP;
