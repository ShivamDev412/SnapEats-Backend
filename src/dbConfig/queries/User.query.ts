import { Address } from "@prisma/client";
import prisma from "..";
import { InternalServerError } from "../../utils/Error";

const createUser = async (name: string, email: string, password: string) => {
  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        storeId: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const createUserWithSocialSingUp = async (
  name: string,
  email: string,
  id: string,
  profilePicture: string,
  provider: string
) => {
  const data: {
    name: string;
    email: string;
    profilePicture: string;
    compressedProfilePicture: string;
    googleId?: string;
    githubId?: string;
    facebookId?: string;
  } = {
    name,
    email,
    profilePicture,
    compressedProfilePicture: profilePicture,
  };
  if (provider === "google") {
    data.googleId = id;
  } else if (provider === "github") {
    data.githubId = id;
  } else if (provider === "facebook") {
    data.facebookId = id;
  }
  try {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        storeId: true,
        profilePicture: true,
        compressedProfilePicture: true,
        refreshTokens: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserByPhoneNumber = async (
  phoneNumber: string,
  countryCode: string
) => {
  try {
    return await prisma.user.findFirst({
      where: {
        phoneNumber,
        countryCode,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserById = async (id: string, password?: boolean) => {
  try {
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
        language: true,
        password: password ? true : false,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserRefreshToken = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        refreshTokens: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserForgotPassword = async (id: string) => {
  try {
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
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const updateUser = async (id: string, data: any) => {
  try {
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
        language: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
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

const getUserPhoneOtp = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        phoneOtp: true,
        phoneOtpExpiry: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserEmailOtp = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        emailOtp: true,
        emailOtpExpiry: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getUserByGoogleId = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        googleId: id,
      },
    });
    return user;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getCartByUserId = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: {
            menuItemId: true,
            quantity: true,
          },
        },
      },
    });
    return cart;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
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
  getUserByPhoneNumber,
  getUserByGoogleId,
  createUserWithSocialSingUp,
  getCartByUserId,
};
