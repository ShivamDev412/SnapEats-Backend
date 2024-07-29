import { InternalServerError } from "../../utils/Error";
import {
  createStore,
  getStoreByEmail,
  getStoreById,
  getStoreByPhoneNumber,
  updateStoreById,
} from "../../dbConfig/queries/Store/Store.query";
import { MESSAGES, SOCKET_EVENT } from "../../utils/Constant";
import { StoreAccountRequestTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";
import { getUserById } from "../../dbConfig/queries/User/User.query";
import { io } from "../../index";
import {
  deleteImageFromS3,
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../../utils/UploadToS3";
class StoreService {
  async registerStore(
    userId: string,
    name: string,
    address: string,
    lat: number,
    lon: number,
    phoneNumber: string,
    countryCode: string,
    email: string
  ) {
    const user = await getUserById(userId);

    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    const existingStoreWithEmail = await getStoreByEmail(email);
    if (existingStoreWithEmail) {
      throw new InternalServerError(MESSAGES.STORE_WITH_EMAIL_EXISTS);
    }
    const existingStoreWithPhoneNumber = await getStoreByPhoneNumber(
      phoneNumber,
      countryCode
    );
    if (existingStoreWithPhoneNumber) {
      throw new InternalServerError(MESSAGES.STORE_WITH_PHONE_NUMBER_EXISTS);
    }
    const newStore = await createStore(
      userId,
      name,
      address,
      lat,
      lon,
      phoneNumber,
      countryCode,
      email
    );
    if (newStore) {
      const storeEmailTemplate = StoreAccountRequestTemplate(
        user.name,
        newStore.name,
        newStore.email,
        newStore.address?.address || "",
        `${newStore.countryCode}${newStore.phoneNumber}`
      );
      await sendToMail(user.email, "Store Account Request", storeEmailTemplate);
      io.emit(SOCKET_EVENT.NEW_STORE_REQUEST, {
        userName: user.name,
        storeName: newStore.name,
        storeEmail: newStore.email,
        storeAddress: newStore.address?.address,
        storePhone: `${newStore.countryCode}${newStore.phoneNumber}`,
      });
      return newStore;
    }
  }
  async updateUserProfile(
    storeId: string,
    name: string,
    email: string,
    file: Express.Multer.File | undefined,
    image?: string | undefined
  ) {
    const dataToUpdate: {
      name: string;
      image?: string;
      email: string;
      compressedImage?: string;
      emailVerified?: boolean;
    } = {
      name,
      email,
    };
    if (file) {
      try {
        const currentStore = await getStoreById(storeId);
        //* delete previous images
        if (currentStore?.image)
          await deleteImageFromS3(currentStore?.image as string);
        if (currentStore?.compressedImage)
          await deleteImageFromS3(currentStore?.compressedImage as string);
        //* upload new images
        const uploadedProfilePicture = await uploadToS3(
          name,
          file?.buffer,
          file?.mimetype,
          1080,
          1920
        );
        const uploadedCompressedProfilePicture =
          await uploadCompressedImageToS3(name, file?.buffer, file?.mimetype);
        if (!uploadedProfilePicture || !uploadedCompressedProfilePicture) {
          throw new InternalServerError(MESSAGES.IMAGE_ERROR);
        }
        // * update user with new images
        dataToUpdate.image = uploadedProfilePicture;
        dataToUpdate.compressedImage = uploadedCompressedProfilePicture;

        dataToUpdate.emailVerified =
          currentStore?.email === email && currentStore?.emailVerified;
        const updatedStore = await updateStoreById(storeId, dataToUpdate);

        const image =
          updatedStore.image && (await getImage(updatedStore.image as string));
        const compressedImage =
          updatedStore.compressedImage &&
          (await getImage(updatedStore.compressedImage as string));

        return {
          ...updatedStore,
          image,
          compressedImage,
        };
      } catch (error) {
        throw new InternalServerError(MESSAGES.IMAGE_ERROR);
      }
    } else {
      const currentStore = await getStoreById(storeId);
      dataToUpdate.emailVerified =
        currentStore?.email === email && currentStore?.emailVerified;
      const updatedUser = await updateStoreById(storeId, dataToUpdate);
      return updatedUser;
    }
  }
}
export default StoreService;
