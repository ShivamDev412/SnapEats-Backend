import { InternalServerError } from "../../utils/Error";
import prisma from "..";
import { Option } from "../../services/Store/Menu.service";
import { create } from "domain";

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
        menuItems: {
          select: {
            id: true,
          },
        },
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
  isVeg: boolean,
  prepTime: number,
  options?: Option[]
) => {
  const menuItemData: any = {
    name,
    description,
    price: parseFloat(basePrice),
    prepTime,
    isVeg,
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
const getMenuItemsByStoreId = async (
  storeId: string,
  categoryId: string | undefined,
  search: string | undefined
) => {
  const condition: {
    storeId: string;
    categoryId?: string;
    name?: {
      contains: string;
      mode: "insensitive";
    };
  } = {
    storeId: storeId,
  };

  if (categoryId) {
    condition.categoryId = categoryId;
  }

  if (search) {
    condition.name = {
      contains: search,
      mode: "insensitive",
    };
  }
  const menuItems = await prisma.menuItem.findMany({
    where: condition,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isVeg: true,
      prepTime: true,
      compressedImage: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return menuItems;
};

const getMenuItemById = async (storeId: string, menuId: string) => {
  const menuItems = await prisma.menuItem.findUnique({
    where: {
      storeId,
      id: menuId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isVeg: true,
      prepTime: true,
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

  return menuItems;
};
async function deleteMenuItemById(menuItemId: string) {
  try {
    const menuItemOptions = await prisma.menuItemOption.findMany({
      where: {
        menuItemId: menuItemId,
      },
      select: {
        id: true,
      },
    });
    const menuItemOptionIds = menuItemOptions.map((option) => option.id);
    await prisma.menuItemChoice.deleteMany({
      where: {
        menuItemOptionId: {
          in: menuItemOptionIds,
        },
      },
    });
    await prisma.menuItemOption.deleteMany({
      where: {
        menuItemId: menuItemId,
      },
    });
    await prisma.menuItem.delete({
      where: {
        id: menuItemId,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
}
async function updateMenuItem(
  menuItemId: string,
  name: string,
  description: string,
  basePrice: string,
  categoryId: string,
  image: string,
  compressedImage: string,
  storeId: string,
  isVeg: boolean,
  prepTime: number,
  options?: {
    optionId: string;
    choice: {
      choiceId: string;
      name: string;
      additionalPrice: number;
    }[];
  }[]
) {
  const menuItemData: any = {
    name,
    description,
    price: parseFloat(basePrice),
    prepTime,
    isVeg,
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
    options: {
      create: options?.map((option) => ({
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
    },
  };
  try {
    const menuItemOptions = await prisma.menuItemOption.findMany({
      where: {
        menuItemId: menuItemId,
      },
      select: {
        id: true,
      },
    });
    const menuItemOptionIds = menuItemOptions.map((option) => option.id);
    await prisma.menuItemChoice.deleteMany({
      where: {
        menuItemOptionId: {
          in: menuItemOptionIds,
        },
      },
    });
    await prisma.menuItemOption.deleteMany({
      where: {
        menuItemId: menuItemId,
      },
    });
    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: menuItemData,
    });
    return updatedMenuItem;
  } catch (err: any) {
    throw new Error(`Failed to update MenuItem: ${err.message}`);
  }
}
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
  getMenuItemById,
  deleteMenuItemById,
  updateMenuItem,
};
