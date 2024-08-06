import prisma from "../../../dbConfig";

const getUsersForAdmin = async (page: number, pageSize: number) => {
  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerified: true,
        phoneNumberVerified: true,
        countryCode: true,
        storeId: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    totalCount,
    page,
    pageSize,
  };
};

const getStoresForAdmin = async (page: number, pageSize: number) => {
  const [stores, totalCount] = await prisma.$transaction([
    prisma.store.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerified: true,
        phoneNumberVerified: true,
        countryCode: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            countryCode: true,
            phoneNumber: true,
          },
        },
        address: {
          select: {
            address: true,
          },
        },
        status: true,
      },
    }),
    prisma.store.count(),
  ]);

  return {
    stores,
    totalCount,
    page,
    pageSize,
  };
};

export { getUsersForAdmin, getStoresForAdmin };
