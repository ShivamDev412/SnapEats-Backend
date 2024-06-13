import { InternalServerError } from "../../utils/Error";
import prisma from "..";
import { Option } from "../../services/Store/Menu.service";
import { getImage } from "../../utils/UploadToS3";

const createStore = async (
  userId: string,
  name: string,
  address: string,
  lat: number,
  lon: number,
  phoneNumber: string,
  countryCode: string,
  email: string
) => {
  try {
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        phoneNumber,
        countryCode,
        email,
        status: "PENDING",
        address: {
          create: {
            address,
            lat,
            lon,
          },
        },
      },
      select: {
        address: true,
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        countryCode: true,
        userId: true,
        status: true,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { storeId: newStore.id },
    });

    return newStore;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  } finally {
    await prisma.$disconnect();
  }
};
const getStoreByEmail = (email: string) => {
  return prisma.store.findFirst({
    where: {
      email,
    },
  });
};
const getStoreByPhoneNumber = (phoneNumber: string, countryCode: string) => {
  return prisma.store.findFirst({
    where: {
      phoneNumber,
      countryCode,
    },
  });
};
const getPendingStores = () => {
  return prisma.store.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      countryCode: true,
      userId: true,
      address: {
        select: {
          address: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
    },
  });
};
const getStoreById = (id: string) => {
  return prisma.store.findFirst({
    where: {
      id,
    },
  });
};
const getStoreByUserId = (id: string) => {
  return prisma.store.findFirst({
    where: {
      userId: id,
    },
  });
};
const updateStoreById = async (id: string, data: any) => {
  try {
    const updatedStore = await prisma.store.update({
      where: { id },
      data,
    });
    return updatedStore;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const removeStoreById = async (userId: string, storeId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { storeId: null },
  });
  await prisma.storeAddress.delete({
    where: {
      storeId: storeId,
    },
  });
  await prisma.store.delete({
    where: {
      id: storeId,
    },
  });
};
const getPhoneNumberOTP = (id: string) => {
  return prisma.store.findFirst({
    where: { id },
    select: { phoneOtp: true, phoneOtpExpiry: true },
  });
};
const getStoreEmailOtp = (id: string) => {
  return prisma.store.findFirst({
    where: { id },
    select: { emailOtp: true, emailOtpExpiry: true },
  });
};
const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  } catch (err: any) {
    throw new InternalServerError(err.message);
  }
};
const getOptions = async () => {
  try {
    return await prisma.option.findMany();
  } catch (err: any) {
    throw new InternalServerError(err.message);
  }
};
const getChoiceByOptionId = async (optionId: string) => {
  return await prisma.predefinedChoice.findMany({
    where: {
      optionId,
    },
  });
};
const createMenuItem = async (
  name: string,
  description: string,
  basePrice: string,
  categoryId: string,
  image: string,
  compressedImage: string,
  storeId: string,
  options?: Option[]
) => {
  const menuItemData: any = {
    name,
    description,
    price: parseFloat(basePrice),
    category: {
      connect: {
        id: categoryId,
      },
    },
    store: {
      connect: {
        id: storeId,
      },
    },
    image,
    compressedImage,
    isVeg: true,
  };

  if (options && options.length > 0) {
    menuItemData.options = {
      create: options.map((option) => ({
        option: {
          connect: {
            id: option.optionId,
          },
        },
        choices: {
          create: option.choice.map((choice) => ({
            predefinedChoiceId: choice.choiceId || null,
            customChoice: choice.name || null,
            additionalPrice: choice.additionalPrice,
          })),
        },
      })),
    };
  }
  try {
    const newMenu = await prisma.menuItem.create({
      data: menuItemData,
    });
    return newMenu;
  } catch (err: any) {
    throw new InternalServerError(err.message);
  }
};
const getMenuItemsByStoreId = async (storeId: string) => {
  const menuItems = await prisma.menuItem.findMany({
    where: {
      storeId: storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true, // This will be treated as basePrice
      image: true,
      compressedImage: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      options: {
        select: {
          id: true,
          optionId: true,
          option: {
            select: {
              id: true,
              name: true,
            },
          },
          choices: {
            select: {
              id: true,
              predefinedChoiceId: true,
              predefinedChoice: {
                select: {
                  id: true,
                  name: true,
                },
              },
              customChoice: true,
              additionalPrice: true,
            },
          },
        },
      },
    },
  });

  const menuToSend = await Promise.all(
    menuItems.map(async (menu) => {
      return {
        ...menu,
        image: menu.image ? await getImage(menu.image) : null,
        compressedImage: menu.compressedImage
          ? await getImage(menu.compressedImage)
          : null,
      };
    })
  );

  return menuToSend;
};
export {
  createStore,
  getStoreByEmail,
  getStoreByPhoneNumber,
  getPendingStores,
  getStoreByUserId,
  updateStoreById,
  removeStoreById,
  getStoreById,
  getPhoneNumberOTP,
  getStoreEmailOtp,
  getCategories,
  getOptions,
  getChoiceByOptionId,
  createMenuItem,
  getMenuItemsByStoreId,
};
