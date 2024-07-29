import { InternalServerError } from "../../../utils/Error";
import prisma from "../../../dbConfig";
import { Address } from "@prisma/client";

const getUserAddressById = async (id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          defaultAddressId: true,
          addresses: true,
        },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      const addressesWithDefaultFlag = user.addresses.map((address) => ({
        ...address,
        isDefault: address.id === user.defaultAddressId,
      }));
  
      return addressesWithDefaultFlag;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  
  const createAddress = async (id: string, data: Address) => {
    try {
      const newAddress = await prisma.address.create({
        data: {
          ...data,
          userId: id,
        },
      });
      return newAddress;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  
  const updateAddress = async (addressId: string, data: any) => {
    try {
      return await prisma.address.update({
        where: {
          id: addressId,
        },
        data,
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  
  const deleteAddress = async (id: string) => {
    try {
      return await prisma.address.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  
  const markAddressAsDefault = async (userId: string, addressId: string) => {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          defaultAddressId: addressId,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  export {
    getUserAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    markAddressAsDefault,

  }