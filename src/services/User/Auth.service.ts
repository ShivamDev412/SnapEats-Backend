import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  createUserWithSocialSingUp,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../../dbConfig/queries/User/User.query";
import { MESSAGES, SALT_ROUNDS } from "../../utils/Constant";
import { createAuthToken, createRefreshToken } from "../../utils/GenerateToken";
import { AuthError, ForbiddenError, NotFoundError } from "../../utils/Error";
import prisma from "../../dbConfig";
import { getStoreByUserId } from "../../dbConfig/queries/Store/Store.query";

class AuthService {
  async loginUser(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user?.password as string);
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
  async socialLoginOrSignup(
    id: string,
    displayName: string,
    email: string,
    profilePicture: string,
    provider: "google" | "github"
  ) {
    const user = await getUserByEmail(email);
    switch (provider) {
      case "google":
        if (!user?.googleId) {
          await updateUser(user?.id as string, {
            googleId: id,
          });
        }
        break;
      case "github":
        if (!user?.githubId) {
          await updateUser(user?.id as string, {
            githubId: id,
          });
        }
        break;
    }
    let isStoreRegistered = false;
    if (user) {
      const token = user.storeId
        ? createAuthToken(user.id, user.email, user?.storeId)
        : createAuthToken(user.id, user.email);
      const refreshToken = createRefreshToken(user.id);
      if (user.storeId) {
        const store = await getStoreByUserId(user.id);
        store?.status === "APPROVED"
          ? (isStoreRegistered = true)
          : (isStoreRegistered = false);
      }
      return {
        user,
        token,
        refreshToken,
        isStoreRegistered,
        userType: "existingUser",
      };
    } else {
      const user = await createUserWithSocialSingUp(
        displayName,
        email,
        id,
        profilePicture,
        provider
      );
      const token = user.storeId
        ? createAuthToken(user.id, user.email, user?.storeId)
        : createAuthToken(user.id, user.email);
      const refreshToken = createRefreshToken(user.id);
      await updateUser(user.id, {
        refreshTokens: [refreshToken],
      });
      return {
        user,
        token,
        refreshToken,
        isStoreRegistered,
        userType: "newUser",
      };
    }
  }
}
export default AuthService;
