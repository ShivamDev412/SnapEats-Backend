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
const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
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
  });
};
const getUserAddressById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      addresses: true,
    },
  });
};
const createAddress = async (id: string, data: any) => {
  return await prisma.address.create({
    data: {
      ...data,
      userId: id,
    },
  });
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
};
