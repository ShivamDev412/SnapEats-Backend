import { InternalServerError } from "../../utils/Error";
import {
  createStore,
  getStoreByEmail,
  getStoreByPhoneNumber,
} from "../../dbConfig/queries/Store.query";
import { MESSAGES, SOCKET_EVENT } from "../../utils/Constant";
import { StoreAccountRequestTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";
import { getUserById } from "../../dbConfig/queries/User.query";
import {io} from "../../utils/SocketInstance";
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
}
export default StoreService;
