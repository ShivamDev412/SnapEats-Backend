import { InternalServerError } from "../../utils/Error";
import prisma from "..";

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
  } finally {
    await prisma.$disconnect();
  }
};
const getStoreByEmail = (email: string) => {
  return prisma.store.findFirst({
    where: {
      email,
    },
  });
};
const getStoreByPhoneNumber = (phoneNumber: string, countryCode: string) => {
  return prisma.store.findFirst({
    where: {
      phoneNumber,
      countryCode,
    },
  });
};
const getPendingStores = () => {
  return prisma.store.findMany({
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
};
const getStoreByUserId = (id: string) => {
  return prisma.store.findFirst({
    where: {
      userId: id,
    },
  });
};
const updateStoreById = (id: string, data: any) => {
  return prisma.store.update({
    where: { id },
    data,
  });
};
const removeStoreById = async (userId: string, storeId: string) => {
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
};
export {
  createStore,
  getStoreByEmail,
  getStoreByPhoneNumber,
  getPendingStores,
  getStoreByUserId,
  updateStoreById,
  removeStoreById,
};
