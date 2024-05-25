import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "../dbConfig/queries/User.query";
import { MESSAGES } from "../utils/Constant";
import { createAuthToken, createRefreshToken } from "../utils/GenerateToken";
import { AuthError, NotFoundError } from "../utils/Error";
import { uploadCompressedImageToS3, uploadToS3 } from "../utils/UploadToS3";

const SALT_ROUNDS = 10;
class AuthService {
  async loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError(MESSAGES.INVALID_PASSWORD);
    const token = createAuthToken(user.id, user.email);
    const refreshToken = createRefreshToken(user.id);
    return { user, token, refreshToken };
  }
  async signupUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    file: Express.Multer.File
  ) {
    const user = await getUserByEmail(email);
    if (user) throw new AuthError(MESSAGES.USER_ALREADY_EXISTS);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
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
    const newUser = await createUser(
      `${firstName} ${lastName}`,
      email,
      hashedPassword,
      profilePicture,
      compressedProfilePicture
    );
    const token = createAuthToken(newUser.id, newUser.email);
    const refreshToken = createRefreshToken(newUser.id);
    await updateUser(newUser.id, {
      refreshTokens: [refreshToken],
    });
    return { token, refreshToken };
  }
}
export default AuthService;
