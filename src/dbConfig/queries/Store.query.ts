import { InternalServerError } from "@/utils/Error";
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
        address: {
          create: {
            address,
            lat,
            lon,
          },
        },
      },
      select:{
        address:true,
        id:true,
        name:true,
        email:true,
        phoneNumber:true,
        countryCode:true,
        userId:true
      }
    });
    return newStore;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getStoreByEmail = (email: string) => {
  return prisma.store.findFirst({
    where: {
      email,
    },
  });
};
const getStoreByPhoneNumber = (phoneNumber: string,countryCode: string) => {
    return prisma.store.findFirst({
      where: {
        phoneNumber,
        countryCode,
      },
    });
}
export { createStore, getStoreByEmail, getStoreByPhoneNumber };
