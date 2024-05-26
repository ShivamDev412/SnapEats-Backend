import { InternalServerError, NotFoundError } from "../utils/Error";
import { getUserById, updateUser } from "../dbConfig/queries/User.query";
import { MESSAGES } from "../utils/Constant";
import {
  deleteImageFromS3,
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../utils/UploadToS3";

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
}
export default UserService;
