import { InternalServerError, NotFoundError } from "../utils/Error";
import { getUserById } from "../dbConfig/queries/User.query";
import { MESSAGES } from "../utils/Constant";
import { getImage } from "../utils/UploadToS3";

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
}
export default UserService;
