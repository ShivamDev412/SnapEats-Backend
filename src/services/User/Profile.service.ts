import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  getUserById,
  getUserByPhoneNumber,
  getUserEmailOtp,
  getUserPhoneOtp,
  updateUser,
} from "../../dbConfig/queries/User/User.query";
import { MESSAGES } from "../../utils/Constant";
import { getImage } from "../../utils/UploadToS3";

import { EmailVerificationTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";
import generateRandomOTP from "../../utils/GenerateOTP";
import sentOTP from "../../utils/Twillo";
class ProfileService {
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
      profilePicture: updatedUser.profilePicture
        ? await getImage(updatedUser.profilePicture as string)
        : null,
      compressedProfilePicture: updatedUser.compressedProfilePicture
        ? await getImage(updatedUser.compressedProfilePicture as string)
        : null,
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
export default ProfileService;
