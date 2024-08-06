import prisma from "../..";
import { InternalServerError } from "../../../utils/Error";

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
const getUserStripeCustomerId = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        stripeCustomerId: true,
        email: true,
        paymentMethodId: true,
        defaultAddressId: true,
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

export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getUserForgotPassword,
  getUserRefreshToken,
  getUserPhoneOtp,
  getUserEmailOtp,
  getUserByPhoneNumber,
  getUserByGoogleId,
  createUserWithSocialSingUp,
  getUserStripeCustomerId,
};
