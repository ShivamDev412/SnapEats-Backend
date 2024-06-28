import prisma from "..";
import { InternalServerError } from "../../utils/Error";

const createAdmin = async (email: string, password: string) => {
  try {
    const newUser = await prisma.adminUser.create({
      data: {
        email,
        password,
      },
    });
    return newUser;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getAdminById = async (id: string) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getAdminByEmail = async (email: string) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const updateAdmin = async (id: string, data: any) => {
  try {
    const user = await prisma.adminUser.update({
      where: {
        id,
      },
      data,
    });
    return user;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getAdminRefreshToken = async (id: string) => {
  try {
    return await prisma.adminUser.findUnique({
      where: {
        id,
      },
      select: {
        refreshTokens: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

export {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  updateAdmin,
  getAdminRefreshToken,
};
