import { NotFoundError } from "../../utils/Error";
import { getUserById } from "../../dbConfig/queries/User/User.query";
import {
  createAddress,
  markAddressAsDefault,
  updateAddress,
} from "../../dbConfig/queries/User/Address.query";
import { MESSAGES } from "../../utils/Constant";
import { Address } from "@prisma/client";

class AddressService {
  async createAddress(userId: string, address: Address) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const newAddress = await createAddress(userId, address);
    return newAddress;
  }
  async updateAddress(userId: string, addressId: string, address: Address) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const updatedAddress = await updateAddress(addressId, address);
    return updatedAddress;
  }
  async markAddressAsDefault(userId: string, addressId: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const updatedAddress = await markAddressAsDefault(userId, addressId);
    return updatedAddress;
  }
}
export default AddressService;
