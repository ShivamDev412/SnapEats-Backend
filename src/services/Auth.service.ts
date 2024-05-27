import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../dbConfig/queries/User.query";
import { MESSAGES } from "../utils/Constant";
import { createAuthToken, createRefreshToken } from "../utils/GenerateToken";
import { AuthError, ForbiddenError, NotFoundError } from "../utils/Error";
import { uploadCompressedImageToS3, uploadToS3 } from "../utils/UploadToS3";
import prisma from "../dbConfig";

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
  ) {
    const user = await getUserByEmail(email);
    if (user) throw new AuthError(MESSAGES.USER_ALREADY_EXISTS);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser(
      `${firstName} ${lastName}`,
      email,
      hashedPassword,
    );
    const token = createAuthToken(newUser.id, newUser.email);
    const refreshToken = createRefreshToken(newUser.id);
    await updateUser(newUser.id, {
      refreshTokens: [refreshToken],
    });
    return { token, refreshToken };
  }
  async refreshToken(refreshToken: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        refreshTokens: {
          hasSome: [refreshToken],
        },
      },
    });

    if (!existingUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decode: any) => {
          if (err) {
            const hackedUser = await getUserById(decode?.id);
            await updateUser(hackedUser?.id as string, {
              refresh_token: [],
            });
            throw new ForbiddenError(MESSAGES.INVALID_REFRESH_TOKEN);
          }
        }
      );
      throw new ForbiddenError(MESSAGES.NOT_USER_WITH_THIS_REFRESH_TOKEN);
    } else {
      let accessTokenToSend:string = "";
      let refreshTokenToSend:string = "";
      const newRefreshTokenArray = existingUser?.refreshTokens.filter(
        (token: string) => {
          return token !== refreshToken;
        }
      );
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decode: any) => {
          if (err) {
            await updateUser(existingUser.id, {
              refreshTokens: [...newRefreshTokenArray],
            });
          }
          if (err || existingUser.id !== decode?.id) {
            throw new ForbiddenError(MESSAGES.INVALID_REFRESH_TOKEN);
          }
          accessTokenToSend = createAuthToken(
            existingUser.id,
            existingUser.email
          );
          refreshTokenToSend = createRefreshToken(existingUser.id);
          await updateUser(existingUser.id, {
            refreshTokens: [...newRefreshTokenArray, refreshTokenToSend],
          });
        }
      );
      return { accessTokenToSend, refreshTokenToSend };
    }
  }
}
export default AuthService;
