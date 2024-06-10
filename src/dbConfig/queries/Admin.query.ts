import { AdminUser } from "@prisma/client";
import prisma from "..";

const createAdmin = async (email: string, password: string) => {
  const newUser = await prisma.adminUser.create({
    data: {
      email,
      password,
    },
  });
  return newUser;
};
const getAdminById = async (id: string) => {
  const user = await prisma.adminUser.findUnique({
    where: {
      id,
    },
  });
  return user;
};
const getAdminByEmail = async (email: string) => {
  const user = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });
  return user;
};
const updateAdmin = async (id: string, data: any) => {
  const user = await prisma.adminUser.update({
    where: {
      id,
    },
    data,
  });
  return user;
};
const getAdminRefreshToken = async (id: string) => {
  return await prisma.adminUser.findUnique({
    where: {
      id,
    },
    select: {
      refreshTokens: true,
    },
  });
};
export {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  updateAdmin,
  getAdminRefreshToken,
};
