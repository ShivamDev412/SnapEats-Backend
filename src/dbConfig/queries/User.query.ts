import { Address, User } from "@prisma/client";
import prisma from "..";

const createUser = async (
  name: string,
  email: string,
  password: string
  // profilePicture: string,
  // compressedProfilePicture: string
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
      // profilePicture,
      // compressedProfilePicture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      // profilePicture: true,
      // compressedProfilePicture: true,
    },
  });
};
const getUserByEmail = async (email: string, ) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
const getUserByPhoneNumber = async (phoneNumber: string,countryCode: string) => {
  return await prisma.user.findFirst({
    where: {
      phoneNumber,
      countryCode
    },
  });

}
const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      compressedProfilePicture: true,
      storeId: true,
      emailVerified: true,
      phoneNumberVerified: true,
      phoneNumber: true,
      defaultAddressId: true,
      addresses: true,
      countryCode: true,
      googleId: true,

    },
  });
};
const getUserRefreshToken = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      refreshTokens: true,
    },
  });
};

const getUserForgotPassword = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      passwordResetToken: true,
      passwordResetTokenExpiry: true,
    },
  });
};

const updateUser = async (id: string, data: any) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      compressedProfilePicture: true,
      storeId: true,
      emailVerified: true,
      phoneNumberVerified: true,
      phoneNumber: true,
      defaultAddressId: true,
      addresses: true,
      countryCode: true,
      googleId: true,
    },
  });
};
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
  } catch (err) {
    throw err;
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
  } catch (err) {
    console.log(err);
  }
};
const updateAddress = async (addressId: string, data: any) => {
  return await prisma.address.update({
    where: {
      id: addressId,
    },
    data,
  });
};
const deleteAddress = async (id: string) => {
  return await prisma.address.delete({
    where: {
      id,
    },
  });
};
const markAddressAsDefault = async (userId: string, addressId: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      defaultAddressId: addressId,
    },
  });
};
const getUserPhoneOtp = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      phoneOtp: true,
      phoneOtpExpiry: true,
    },
  });
};
const getUserEmailOtp = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      emailOtp: true,
      emailOtpExpiry: true,
    },
  });
};
export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getUserForgotPassword,
  getUserRefreshToken,
  getUserAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  markAddressAsDefault,
  getUserPhoneOtp,
  getUserEmailOtp,
  getUserByPhoneNumber
};
