import bcrypt from "bcryptjs";
import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  getUserByEmail,
  getUserById,
  getUserForgotPassword,
  updateUser,
} from "../../dbConfig/queries/User.query";
import { MESSAGES, SALT_ROUNDS } from "../../utils/Constant";
import {
  deleteImageFromS3,
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../../utils/UploadToS3";
import { generateToken, verifyToken } from "../../utils/GenerateToken";
import { ForgotPasswordTemplate } from "../../utils/EmailTemplates";
import { sendToMail } from "../../utils/NodeMailer";

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
    const { id } = verifyToken(token);
    const user = await getUserForgotPassword(id);
    if (!user || token !== user?.passwordResetToken)
      throw new InternalServerError(MESSAGES.INVALID_TOKEN);
    if (
      user?.passwordResetTokenExpiry &&
      user?.passwordResetTokenExpiry < new Date()
    ) {
      throw new InternalServerError(MESSAGES.TOKEN_EXPIRED);
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const updatedUser = await updateUser(id, {
      password: hashedPassword,
      passwordResetToken: "",
      passwordResetTokenExpiry: null,
    });
    return updatedUser;
  }
}
export default UserService;
