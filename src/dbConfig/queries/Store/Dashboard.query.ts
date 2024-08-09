import prisma from "../../../dbConfig";

const totalNumberOfOrders = async (storeId: string) => {
  const count = await prisma.order.count({
    where: {
      storeId,
    },
  });
  return count;
};

const totalIncomeGenerated = async (storeId: string) => {
  const totalIncome = await prisma.order.aggregate({
    where: {
      storeId,
    },
    _sum: {
      totalAmount: true,
      applicationFee: true,
    },
  });

  const incomeGenerated =
    (totalIncome._sum.totalAmount || 0) -
    (totalIncome._sum.applicationFee || 0);

  return incomeGenerated;
};

const averageOrderValue = async (storeId: string) => {
  const avgOrderValue = await prisma.order.aggregate({
    where: {
      storeId,
    },
    _avg: {
      totalAmount: true,
    },
  });

  return avgOrderValue._avg.totalAmount || 0;
};

const ordersInLastWeek = async (storeId: string) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const count = await prisma.order.count({
    where: {
      storeId,
      createdAt: {
        gte: lastWeek,
      },
    },
  });

  return count;
};

const ordersInLastMonth = async (storeId: string) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const count = await prisma.order.count({
    where: {
      storeId,
      createdAt: {
        gte: lastMonth,
      },
    },
  });

  return count;
};

const ordersInLast3Months = async (storeId: string) => {
  const last3Months = new Date();
  last3Months.setMonth(last3Months.getMonth() - 3);

  const count = await prisma.order.count({
    where: {
      storeId,
      createdAt: {
        gte: last3Months,
      },
    },
  });

  return count;
};

const ordersInLast6Months = async (storeId: string) => {
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  const count = await prisma.order.count({
    where: {
      storeId,
      createdAt: {
        gte: last6Months,
      },
    },
  });

  return count;
};

const ordersInLastYear = async (storeId: string) => {
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const count = await prisma.order.count({
    where: {
      storeId,
      createdAt: {
        gte: lastYear,
      },
    },
  });

  return count;
};

const mostOrderedItems = async (storeId: string) => {
  const groupedItems = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    where: {
      order: {
        storeId,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const itemsWithDetails = await Promise.all(
    groupedItems.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        select: { id: true, name: true },
      });

      return {
        id: menuItem?.id,
        name: menuItem?.name,
        quantity: item._sum.quantity,
      };
    })
  );

  return itemsWithDetails;
};

const dailyRevenueForLast30Days = async (storeId: string) => {
  const today = new Date();
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const revenue = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      storeId,
      createdAt: {
        gte: last30Days,
        lte: today,
      },
    },
    _sum: {
      totalAmount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return revenue.map((entry) => ({
    date: entry.createdAt.toISOString().split('T')[0],
    revenue: entry._sum.totalAmount || 0,
  }));
};
export {
  totalNumberOfOrders,
  totalIncomeGenerated,
  averageOrderValue,
  ordersInLastWeek,
  ordersInLastMonth,
  ordersInLast3Months,
  ordersInLast6Months,
  ordersInLastYear,
  mostOrderedItems,
  dailyRevenueForLast30Days,
};
