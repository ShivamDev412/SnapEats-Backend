import { InternalServerError } from "../../../utils/Error";
import prisma from "../../index";

const createStore = async (
  userId: string,
  name: string,
  address: string,
  lat: number,
  lon: number,
  phoneNumber: string,
  countryCode: string,
  email: string
) => {
  try {
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        phoneNumber,
        countryCode,
        email,
        status: "PENDING",
        address: {
          create: {
            address,
            lat,
            lon,
          },
        },
      },
      select: {
        address: true,
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        countryCode: true,
        userId: true,
        status: true,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { storeId: newStore.id },
    });

    return newStore;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreByEmail = async (email: string) => {
  try {
    return await prisma.store.findFirst({
      where: {
        email,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreByPhoneNumber = async (
  phoneNumber: string,
  countryCode: string
) => {
  try {
    return await prisma.store.findFirst({
      where: {
        phoneNumber,
        countryCode,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getPendingStores = async () => {
  try {
    return await prisma.store.findMany({
      where: {
        status: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        countryCode: true,
        userId: true,
        address: {
          select: {
            address: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getStorePrimaryDetails = async (storeId: string) => {
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        countryCode: true,
        image: true,
        compressedImage: true,
        openTime: true,
        closeTime: true,
        specialEventCloseTime: true,
        specialEventOpenTime: true,
        deliveryFee: true,
        address: {
          select: {
            address: true,
            lat: true,
            lon: true,
          },
        },
      },
    });
    return store;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreHomeById = async (id: string) => {
  try {
    return await prisma.store.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        countryCode: true,
        image: true,
        compressedImage: true,
        userId: true,
        openTime: true,
        closeTime: true,
        specialEventCloseTime: true,
        specialEventOpenTime: true,
        deliveryFee: true,
        menuItems: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            isVeg: true,
            prepTime: true,
            compressedImage: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            options: {
              select: {
                id: true,
                option: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                choices: {
                  select: {
                    id: true,
                    customChoice: true,
                    additionalPrice: true,
                  },
                },
              },
            },
          },
        },
        address: {
          select: {
            address: true,
            lat: true,
            lon: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            user: {
              select: {
                name: true,
                email: true,
                id: true,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getStoreById = async (id: string) => {
  try {
    return await prisma.store.findFirst({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreByUserId = async (id: string) => {
  try {
    return await prisma.store.findFirst({
      where: {
        userId: id,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const updateStoreById = async (id: string, data: any) => {
  try {
    const updatedStore = await prisma.store.update({
      where: { id },
      data,
    });
    return updatedStore;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const removeStoreById = async (userId: string, storeId: string) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { storeId: null },
    });
    await prisma.storeAddress.delete({
      where: {
        storeId: storeId,
      },
    });
    await prisma.store.delete({
      where: {
        id: storeId,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getPhoneNumberOTP = async (id: string) => {
  try {
    return await prisma.store.findFirst({
      where: { id },
      select: { phoneOtp: true, phoneOtpExpiry: true },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreEmailOtp = async (id: string) => {
  try {
    return await prisma.store.findFirst({
      where: { id },
      select: { emailOtp: true, emailOtpExpiry: true },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getAllStores = async () => {
  try {
    return await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        compressedImage: true,
        openTime: true,
        closeTime: true,
        specialEventCloseTime: true,
        specialEventOpenTime: true,
        menuItems: {
          select: { prepTime: true },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        address: {
          select: {
            address: true,
            lat: true,
            lon: true,
          },
        },
        foodTypes: {
          select: {
            foodType: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getStoreTime = async (storeId: string) => {
  try {
    return await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        openTime: true,
        closeTime: true,
        specialEventCloseTime: true,
        specialEventOpenTime: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getStoreAddressCoordinates = (storeId: string) => {
  return prisma.storeAddress.findFirst({
    where: { storeId },
    select: { lat: true, lon: true },
  });
};
export {
  createStore,
  getStoreByEmail,
  getStoreByPhoneNumber,
  getPendingStores,
  getStoreByUserId,
  updateStoreById,
  removeStoreById,
  getStoreById,
  getPhoneNumberOTP,
  getStoreEmailOtp,
  getAllStores,
  getStoreTime,
  getStoreHomeById,
  getStorePrimaryDetails,
  getStoreAddressCoordinates
};
