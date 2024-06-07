import {
  StoreRegistrationRejectionTemplate,
  StoreVerificationSuccessTemplate,
} from "../../utils/EmailTemplates";
import {
  getPendingStores,
  getStoreByUserId,
  removeStoreById,
  updateStoreById,
} from "../../dbConfig/queries/Store.query";
import { getUserById } from "../../dbConfig/queries/User.query";
import { sendToMail } from "../../utils/NodeMailer";
import { InternalServerError } from "../../utils/Error";
import { EMAIL_SUBJECT, MESSAGES } from "../../utils/Constant";

class AdminService {
  async getStoreRequests() {
    const requestedStores = await getPendingStores();
    return requestedStores;
  }
  async acceptStoreRequest(storeId: string) {
    try {
      const updatedStore = await updateStoreById(storeId, {
        status: "APPROVED",
      });
      const user = await getUserById(updatedStore.userId);
      const successMailTemplate = StoreVerificationSuccessTemplate(
        user?.name as string,
        updatedStore.name
      );
      await sendToMail(
        user?.email as string,
        EMAIL_SUBJECT.STORE_REGISTRATION_SUCCESS,
        successMailTemplate
      );
      return updatedStore;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async rejectStoreRequest(storeId: string, userId: string) {
    try {
      const store = await getStoreByUserId(userId);
      const user = await getUserById(userId);
      if (!user) {
        throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
      }
      const rejectedEmail = StoreRegistrationRejectionTemplate(
        user?.name as string,
        store?.name as string
      );
      await removeStoreById(userId, storeId);
      await sendToMail(
        user.email,
        EMAIL_SUBJECT.STORE_REGISTRATION_REJECTION,
        rejectedEmail
      );
      return true;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
export default AdminService;
