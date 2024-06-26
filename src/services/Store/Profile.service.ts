import moment from "moment-timezone";
import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  getStoreById,
  getStoreByPhoneNumber,
  updateStoreById,
  getPhoneNumberOTP,
  getStoreEmailOtp,
  getFoodTypes,
  addFoodTypeToStore,
  removeFoodTypeFromStore,
  getFoodTypesForStore,
} from "../../dbConfig/queries/Store.query";
import { MESSAGES } from "../../utils/Constant";
import { getImage } from "../../utils/UploadToS3";

import { EmailVerificationTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";
import generateRandomOTP from "../../utils/GenerateOTP";
import sentOTP from "../../utils/Twillo";
const timeStringToDate = (timeString: string): Date => {
  return moment.tz(timeString, "HH:mm", "America/Toronto").toDate();
};
class ProfileService {
  async updatePhoneNumber(
    storeId: string,
    phoneNumber: string,
    countryCode: string
  ) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const existingStore = await getStoreByPhoneNumber(phoneNumber, countryCode);
    if (existingStore) {
      throw new InternalServerError(MESSAGES.PHONE_NUMBER_ALREADY_EXISTS);
    }
    if (
      store?.phoneNumber === phoneNumber &&
      store?.countryCode === countryCode
    ) {
      return store;
    }
    const updatedStore = await updateStoreById(storeId, {
      phoneNumber,
      countryCode,
      phoneNumberVerified: false,
    });
    return {
      ...updatedStore,
      image: updatedStore.image
        ? await getImage(updatedStore.image as string)
        : null,
      compressedImage: updatedStore.compressedImage
        ? await getImage(updatedStore.compressedImage as string)
        : null,
    };
  }
  async sendPhoneNumberOTP(storeId: string, phoneNumber: string) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const opt = generateRandomOTP();
    const message = await sentOTP(opt, phoneNumber);
    await updateStoreById(storeId, {
      phoneOtp: opt,
      phoneOtpExpiry: new Date(Date.now() + 600000),
    });
    return message;
  }
  async verifyOTP(storeId: string, otp: string) {
    const store = await getPhoneNumberOTP(storeId);

    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    if (store?.phoneOtp !== otp)
      throw new InternalServerError(MESSAGES.INVALID_OTP);
    if (store?.phoneOtpExpiry && store.phoneOtpExpiry < new Date())
      throw new InternalServerError(MESSAGES.OTP_EXPIRED);
    const updatedUser = await updateStoreById(storeId, {
      phoneOtp: "",
      phoneOtpExpiry: null,
      phoneNumberVerified: true,
    });
    return updatedUser;
  }
  async resendPhoneNumberOTP(storeId: string) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const opt = generateRandomOTP();
    const message = await sentOTP(opt, store.phoneNumber as string);
    await updateStoreById(storeId, {
      phoneOtp: opt,
      phoneOtpExpiry: new Date(Date.now() + 600000),
    });
    return message;
  }
  async sendEmailOTP(storeId: string, email: string) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const opt = generateRandomOTP();
    const htmlTemplate = EmailVerificationTemplate(store.name, opt);
    const emailResponse = await sendToMail(email, "OTP", htmlTemplate);
    const updatedStore = await updateStoreById(storeId, {
      emailOtp: opt,
      emailOtpExpiry: new Date(Date.now() + 600000),
    });
    return emailResponse;
  }
  async verifyEmailOTP(storeId: string, otp: string) {
    const store = await getStoreEmailOtp(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    if (store?.emailOtp !== otp)
      throw new InternalServerError(MESSAGES.INVALID_OTP);
    if (store?.emailOtpExpiry && store.emailOtpExpiry < new Date())
      throw new InternalServerError(MESSAGES.OTP_EXPIRED);
    const updatedStore = await updateStoreById(storeId, {
      emailOtp: "",
      emailOtpExpiry: null,
      emailVerified: true,
    });
    return updatedStore;
  }
  async resendEmailOTP(storeId: string) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const opt = generateRandomOTP();
    const htmlTemplate = EmailVerificationTemplate(store.name, opt);
    const emailResponse = await sendToMail(
      store.email as string,
      "OTP",
      htmlTemplate
    );
    await updateStoreById(storeId, {
      emailOtp: opt,
      emailOtpExpiry: new Date(Date.now() + 600000),
    });
    return emailResponse;
  }
  async getFoodTypes() {
    return await getFoodTypes();
  }
  async addFoodType(id: string, storeId: string) {
    return await addFoodTypeToStore(id, storeId);
  }
  async removeFoodType(id: string, storeId: string) {
    await removeFoodTypeFromStore(id);
  }
  async getStoreFoodTypes(storeId: string) {
    const foodTypes = await getFoodTypesForStore(storeId);
    return foodTypes;
  }
  async setStoreTiming(
    storeId: string,
    openTime: string,
    closeTime: string,
    type: string
  ) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const openTimeDate = timeStringToDate(openTime);
    const closeTimeDate = timeStringToDate(closeTime);

    const updatedStore = await updateStoreById(
      storeId,
      type === "normalDay"
        ? {
            openTime,
            closeTime,
          }
        : {
            specialEventOpenTime: openTime,
            specialEventCloseTime: closeTime,
          }
    );
    return updatedStore;
  }
}
export default ProfileService;
