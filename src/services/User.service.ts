import bcrypt from "bcryptjs";
import { InternalServerError, NotFoundError } from "../utils/Error";
import {
  getUserByEmail,
  getUserById,
  getUserForgotPassword,
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
import { ForgotPasswordTemplate } from "../utils/EmailTemplates";
import { sendToMail } from "../utils/NodeMailer";

class UserService {
  async getUser(userId: string) {
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError(MESSAGES.USER_BY_ID_NOT_FOUND);

    const profilePicture = await getImage(user?.profilePicture as string);
    const compressedProfilePicture = await getImage(
      user?.compressedProfilePicture as string
    );
    if (!profilePicture || !compressedProfilePicture) {
      throw new InternalServerError(MESSAGES.IMAGE_ERROR);
    }
    return {
      ...user,
      profilePicture,
      compressedProfilePicture,
    };
  }
  async updateUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    file: Express.Multer.File | undefined
  ) {
    const dataToUpdate: {
      name: string;
      profilePicture?: string;
      compressedProfilePicture?: string;
    } = {
      name: `${firstName} ${lastName}`,
    };
    if (file) {
      try {
        const currentUser = await getUserById(userId);
        if (currentUser?.profilePicture)
          await deleteImageFromS3(currentUser?.profilePicture as string);
        if (currentUser?.compressedProfilePicture)
          await deleteImageFromS3(
            currentUser?.compressedProfilePicture as string
          );
        const profilePicture = await uploadToS3(
          firstName,
          file?.buffer,
          file?.mimetype
        );
        const compressedProfilePicture = await uploadCompressedImageToS3(
          firstName,
          file?.buffer,
          file?.mimetype
        );
        console.log(profilePicture, compressedProfilePicture);
        if (!profilePicture || !compressedProfilePicture) {
          throw new InternalServerError(MESSAGES.IMAGE_ERROR);
        }
        dataToUpdate.profilePicture = profilePicture;
        dataToUpdate.compressedProfilePicture = compressedProfilePicture;
      } catch (error) {
        throw new InternalServerError(MESSAGES.IMAGE_ERROR);
      }
    }
    const updatedUser = await updateUser(userId, dataToUpdate);
    const profilePicture = await getImage(updatedUser.profilePicture as string);
    const compressedProfilePicture = await getImage(
      updatedUser.compressedProfilePicture as string
    );
    return {
      ...updatedUser,
      profilePicture,
      compressedProfilePicture,
    };
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
}
export default UserService;
