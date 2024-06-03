import bcrypt from "bcryptjs";
import { InternalServerError, NotFoundError } from "../utils/Error";
import {
  createAddress,
  deleteAddress,
  getUserByEmail,
  getUserById,
  getUserByPhoneNumber,
  getUserEmailOtp,
  getUserForgotPassword,
  getUserPhoneOtp,
  markAddressAsDefault,
  updateAddress,
  updateUser,
} from "../dbConfig/queries/User.query";
import { MESSAGES, SALT_ROUNDS } from "../utils/Constant";
import {
  deleteImageFromS3,
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../utils/UploadToS3";
import { generateToken, verifyToken } from "../utils/GenerateToken";
import {
  EmailVerificationTemplate,
  ForgotPasswordTemplate,
} from "../utils/EmailTemplates";
import { sendToMail } from "../utils/NodeMailer";
import { Address } from "@prisma/client";
import generateRandomOTP from "../utils/GenerateOTP";
import sentOTP from "../utils/Twillo";

class UserService {
  async getUser(userId: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_BY_ID_NOT_FOUND);
    let profilePicture = null;
    let compressedProfilePicture = null;
    if (user?.profilePicture && user?.compressedProfilePicture) {
      profilePicture = await getImage(user?.profilePicture as string);
      compressedProfilePicture = await getImage(
        user?.compressedProfilePicture as string
      );
      if (!profilePicture || !compressedProfilePicture) {
        throw new InternalServerError(MESSAGES.IMAGE_ERROR);
      }
    }
    const dataToSend = {
      ...user,
      profilePicture,
      compressedProfilePicture,
    };

    return dataToSend;
  }
  async updateUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    file: Express.Multer.File | undefined,
    profilePicture?: string | undefined
  ) {
    const dataToUpdate: {
      name: string;
      profilePicture?: string;
      email: string;
      compressedProfilePicture?: string;
      emailVerified?: boolean;
    } = {
      name: `${firstName} ${lastName}`,
      email,
    };
    if (file) {
      try {
        const currentUser = await getUserById(userId);
        //* delete previous images
        if (currentUser?.profilePicture)
          await deleteImageFromS3(currentUser?.profilePicture as string);
        if (currentUser?.compressedProfilePicture)
          await deleteImageFromS3(
            currentUser?.compressedProfilePicture as string
          );
        //* upload new images
        const uploadedProfilePicture = await uploadToS3(
          firstName,
          file?.buffer,
          file?.mimetype
        );
        const uploadedCompressedProfilePicture =
          await uploadCompressedImageToS3(
            firstName,
            file?.buffer,
            file?.mimetype
          );

        if (!uploadedProfilePicture || !uploadedCompressedProfilePicture) {
          throw new InternalServerError(MESSAGES.IMAGE_ERROR);
        }
        // * update user with new images
        dataToUpdate.profilePicture = uploadedProfilePicture;
        dataToUpdate.compressedProfilePicture =
          uploadedCompressedProfilePicture;
        console.log(dataToUpdate, "dataToUpdate");
        dataToUpdate.emailVerified =
          currentUser?.email === email && currentUser?.emailVerified;

        const updatedUser = await updateUser(userId, dataToUpdate);

        const profilePicture =
          updatedUser.profilePicture &&
          (await getImage(updatedUser.profilePicture as string));
        const compressedProfilePicture =
          updatedUser.compressedProfilePicture &&
          (await getImage(updatedUser.compressedProfilePicture as string));

        return {
          ...updatedUser,
          profilePicture,
          compressedProfilePicture,
        };
      } catch (error) {
        throw new InternalServerError(MESSAGES.IMAGE_ERROR);
      }
    } else {
      const currentUser = await getUserById(userId);
      dataToUpdate.emailVerified =
        currentUser?.email === email && currentUser?.emailVerified;
      const updatedUser = await updateUser(userId, dataToUpdate);
      return updatedUser;
    }
  }
  async forgotPassword(email: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const token = generateToken(user.id);
    const expiryTime = Date.now() + 600000;
    await updateUser(user.id, {
      passwordResetToken: token,
      passwordResetTokenExpiry: new Date(expiryTime),
    });
    const htmlTemplate = ForgotPasswordTemplate(user.name, token);
    const emailResponse = await sendToMail(
      email,
      MESSAGES.RESET_PASSWORD_SUBJECT,
      htmlTemplate
    );
    return emailResponse;
  }
  async resetPassword(password: string, token: string) {
    const userId = verifyToken(token);
    const user = await getUserForgotPassword(userId);
    if (!user || token !== user?.passwordResetToken)
      throw new InternalServerError(MESSAGES.INVALID_TOKEN);
    if (
      user?.passwordResetTokenExpiry &&
      user?.passwordResetTokenExpiry < new Date()
    ) {
      throw new InternalServerError(MESSAGES.TOKEN_EXPIRED);
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const updatedUser = await updateUser(userId, {
      password: hashedPassword,
      passwordResetToken: "",
      passwordResetTokenExpiry: null,
    });
    return updatedUser;
  }
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
  async updatePhoneNumber(
    userId: string,
    phoneNumber: string,
    countryCode: string
  ) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const existingUser = await getUserByPhoneNumber(phoneNumber, countryCode);

    if (existingUser) {
      throw new InternalServerError(MESSAGES.PHONE_NUMBER_ALREADY_EXISTS);
    }
    if (
      user?.phoneNumber === phoneNumber &&
      user?.countryCode === countryCode
    ) {
      return user;
    }
    const updatedUser = await updateUser(userId, {
      phoneNumber,
      countryCode,
      phoneNumberVerified: false,
    });
    return {
      ...updatedUser,
      profilePicture: await getImage(updatedUser.profilePicture as string),
      compressedProfilePicture: await getImage(
        updatedUser.compressedProfilePicture as string
      ),
    };
  }
  async sendPhoneNumberOTP(userId: string, phoneNumber: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const opt = generateRandomOTP();
    const message = await sentOTP(opt, phoneNumber);
    await updateUser(userId, {
      phoneOtp: opt,
      phoneOtpExpiry: new Date(Date.now() + 600000),
    });
    return message;
  }
  async verifyOTP(userId: string, otp: string) {
    const user = await getUserPhoneOtp(userId);

    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    if (user?.phoneOtp !== otp)
      throw new InternalServerError(MESSAGES.INVALID_OTP);
    if (user?.phoneOtpExpiry && user.phoneOtpExpiry < new Date())
      throw new InternalServerError(MESSAGES.OTP_EXPIRED);
    const updatedUser = await updateUser(userId, {
      phoneOtp: "",
      phoneOtpExpiry: null,
      phoneNumberVerified: true,
    });
    return updatedUser;
  }
  async resendPhoneNumberOTP(userId: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const opt = generateRandomOTP();
    const message = await sentOTP(opt, user.phoneNumber as string);
    await updateUser(userId, {
      phoneOtp: opt,
      phoneOtpExpiry: new Date(Date.now() + 600000),
    });
    return message;
  }
  async sendEmailOTP(userId: string, email: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const opt = generateRandomOTP();
    const htmlTemplate = EmailVerificationTemplate(user.name, opt);
    const emailResponse = await sendToMail(email, "OTP", htmlTemplate);
    await updateUser(userId, {
      emailOtp: opt,
      emailOtpExpiry: new Date(Date.now() + 600000),
    });
    return emailResponse;
  }
  async verifyEmailOTP(userId: string, otp: string) {
    const user = await getUserEmailOtp(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    if (user?.emailOtp !== otp)
      throw new InternalServerError(MESSAGES.INVALID_OTP);
    if (user?.emailOtpExpiry && user.emailOtpExpiry < new Date())
      throw new InternalServerError(MESSAGES.OTP_EXPIRED);
    const updatedUser = await updateUser(userId, {
      emailOtp: "",
      emailOtpExpiry: null,
      emailVerified: true,
    });
    return updatedUser;
  }
  async resendEmailOTP(userId: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const opt = generateRandomOTP();
    const htmlTemplate = EmailVerificationTemplate(user.name, opt);
    const emailResponse = await sendToMail(
      user.email as string,
      "OTP",
      htmlTemplate
    );
    await updateUser(userId, {
      emailOtp: opt,
      emailOtpExpiry: new Date(Date.now() + 600000),
    });
    return emailResponse;
  }
}
export default UserService;
