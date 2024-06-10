import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../../dbConfig/queries/User.query";
import { MESSAGES, SALT_ROUNDS } from "../../utils/Constant";
import { createAuthToken, createRefreshToken } from "../../utils/GenerateToken";
import { AuthError, ForbiddenError, NotFoundError } from "../../utils/Error";
import prisma from "../../dbConfig";
import { getStoreByUserId } from "../../dbConfig/queries/Store.query";

class AuthService {
  async loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError(MESSAGES.INVALID_PASSWORD);

    const token = user.storeId
      ? createAuthToken(user.id, user.email, user?.storeId)
      : createAuthToken(user.id, user.email);
    const refreshToken = createRefreshToken(user.id);
    let isStoreRegistered = false;
    if (user.storeId) {
      const store = await getStoreByUserId(user.id);
      store?.status === "APPROVED"
        ? (isStoreRegistered = true)
        : (isStoreRegistered = false);
    }
    return { user, token, refreshToken, isStoreRegistered };
  }
  async signupUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const user = await getUserByEmail(email);
    if (user) throw new AuthError(MESSAGES.USER_ALREADY_EXISTS);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser(
      `${firstName} ${lastName}`,
      email,
      hashedPassword
    );
    const token = newUser.storeId
      ? createAuthToken(newUser.id, newUser.email, newUser?.storeId)
      : createAuthToken(newUser.id, newUser.email);
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
        process.env.JWT_SECRET!,
        async (err: any, decode: any) => {
          if (err) {
            const hackedUser = await getUserById(decode?.id);
            await updateUser(hackedUser?.id as string, {
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
            await updateUser(existingUser.id, {
              refreshTokens: [...newRefreshTokenArray],
            });
          }
          if (err || existingUser.id !== decode?.id) {
            throw new ForbiddenError(MESSAGES.INVALID_REFRESH_TOKEN);
          }
          if (existingUser.storeId) {
            accessTokenToSend = createAuthToken(
              existingUser.id,
              existingUser.email,
              existingUser.storeId
            );
          } else {
            accessTokenToSend = createAuthToken(
              existingUser.id,
              existingUser.email
            );
          }
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