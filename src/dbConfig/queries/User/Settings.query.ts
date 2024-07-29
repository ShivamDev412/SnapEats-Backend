import { InternalServerError } from "../../../utils/Error";
import prisma from "../../../dbConfig";

const getTwoFactorSecret = async (userId: string) => {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          twoFactorAuthSecret: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  };
  const getTwoFactorStatus = (userId: any) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        twoFactorAuthEnabled: true,
        twoFactorVerifiedAt: true,
      }
    })
  }
  export {
    getTwoFactorSecret,
    getTwoFactorStatus
  }