const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// import prisma from "./index";
const getUsers = async () => {
  const users = await prisma.user.findMany();
  console.log(users);
};
const removeRefreshToken = async () => {
  await prisma.user.update({
    where: {
      id: "clwlp9hkg0000ype13yejj8p9",
    },
    data: {
      refreshTokens: [],
    },
  });
};
const removeUser = async () => {
  await prisma.user.delete({
    where: {
      id: "clwslp9fm0000cyk0htgxz5bq",
    },
  });
};
const userAddress = async () => {
   const address = await prisma.address.findMany();
   console.log(address, "address");
};
// removeRefreshToken()
// removeUser();
userAddress();
getUsers();
