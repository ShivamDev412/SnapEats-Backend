import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../dbConfig";
import { createAuthToken, createRefreshToken } from "../../utils/GenerateToken";
import { AuthError, ForbiddenError, NotFoundError } from "../../utils/Error";
import { MESSAGES, SALT_ROUNDS } from "../../utils/Constant";
import {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  updateAdmin,
} from "../../dbConfig/queries/Admin.query";

class AuthService {
  async signupUser(email: string, password: string) {
    const user = await getAdminByEmail(email);
    if (user) throw new AuthError(MESSAGES.USER_ALREADY_EXISTS);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createAdmin(email, hashedPassword);
    const token = createAuthToken(newUser.id, newUser.email);
    const refreshToken = createRefreshToken(newUser.id);
    await updateAdmin(newUser.id, {
      refreshTokens: [refreshToken],
    });
    return { token, refreshToken };
  }
  async loginUser(email: string, password: string) {
    const user = await getAdminByEmail(email);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError(MESSAGES.INVALID_PASSWORD);
    const token = createAuthToken(user.id, user.email);
    const refreshToken = createRefreshToken(user.id);

    return { user, token, refreshToken };
  }
  async refreshToken(refreshToken: string) {
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        refreshTokens: {
          hasSome: [refreshToken],
        },
      },
    });

    if (!existingUser) {
      jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!,
        async (err: any, decode: any) => {
          if (err) {
            const hackedUser = await getAdminById(decode?.id);
            await updateAdmin(hackedUser?.id as string, {
              refreshTokens: [],
            });
            throw new ForbiddenError(MESSAGES.INVALID_REFRESH_TOKEN);
          }
        }
      );
      throw new ForbiddenError(MESSAGES.NOT_USER_WITH_THIS_REFRESH_TOKEN);
    } else {
      const newRefreshTokenArray = existingUser?.refreshTokens.filter(
        (token: string) => {
          return token !== refreshToken;
        }
      );
      let accessTokenToSend;
      let refreshTokenToSend;
      jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!,
        async (err: any, decode: any) => {
          if (err) {
            await updateAdmin(existingUser.id, {
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
          await updateAdmin(existingUser.id, {
            refreshTokens: [...newRefreshTokenArray, refreshTokenToSend],
          });
        }
      );
      return { accessTokenToSend, refreshTokenToSend };
    }
  }
}
export default AuthService;
