import { InternalServerError, NotFoundError } from "../../../utils/Error";
import prisma from "../../../dbConfig";
import { MESSAGES } from "../../../utils/Constant";
import { Option } from "../../../services/Store/Menu.service";

const getCategories = async (storeId: string) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        menuItems: {
          where: {
            storeId,
          },
          select: {
            id: true,
          },
        },
      },
    });
    return categories;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getOptions = async () => {
  try {
    return await prisma.option.findMany();
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getChoiceByOptionId = async (optionId: string) => {
  try {
    return await prisma.predefinedChoice.findMany({
      where: {
        optionId,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
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
        isRequired: option.isRequired,
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
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getMenuItemsByStoreId = async (
  storeId: string,
  categoryId: string | undefined,
  search: string | undefined
) => {
  try {
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
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getMenuItemById = async (storeId: string, menuId: string) => {
  try {
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
            isRequired: true,
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
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const deleteMenuItemById = async (menuItemId: string) => {
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
};

const updateMenuItem = async (
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
    options: {
      create: options?.map((option) => ({
        option: {
          connect: {
            id: option.optionId,
          },
        },
        isRequired: option.isRequired,
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
    // Find the existing menu item options
    const menuItemOptions = await prisma.menuItemOption.findMany({
      where: {
        menuItemId: menuItemId,
      },
      select: {
        id: true,
      },
    });

    // Extract the ids of the menu item options
    const menuItemOptionIds = menuItemOptions.map((option) => option.id);

    // Delete the related choices first
    await prisma.menuItemChoice.deleteMany({
      where: {
        menuItemOptionId: {
          in: menuItemOptionIds,
        },
      },
    });

    // Delete the menu item options
    await prisma.menuItemOption.deleteMany({
      where: {
        menuItemId: menuItemId,
      },
    });

    // Update the menu item with the new data
    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: menuItemData,
    });

    return updatedMenuItem;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getFoodTypes = async () => {
  try {
    return await prisma.storeFoodTypes.findMany({
      select: {
        id: true,
        foodType: true,
      },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const addFoodTypeToStore = async (id: string, storeId: string) => {
  try {
    return await prisma.storeFoodTypes.update({
      where: { id },
      data: { storeId },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const removeFoodTypeFromStore = async (id: string) => {
  try {
    return await prisma.storeFoodTypes.update({
      where: { id },
      data: { storeId: null },
    });
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const getFoodTypesForStore = async (storeId: string) => {
  try {
    const foodTypes = await prisma.storeFoodTypes.findMany({
      where: { storeId: storeId },
      select: {
        foodType: true,
        id: true,
      },
    });
    return foodTypes;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  } finally {
    await prisma.$disconnect();
  }
};
const getStoreMenuItems = async (storeId: string) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        menuItems: {
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
                isRequired: true,
                option: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                choices: {
                  select: {
                    id: true,
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
        },
      },
    });

    if (!store) {
      throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    }
    const totalPrepTime = store.menuItems.reduce(
      (acc, item) => acc + item.prepTime,
      0
    );
    const averagePrepTime = store.menuItems.length
      ? totalPrepTime / store.menuItems.length
      : 0;

    return {
      menuItems: store.menuItems,
      averagePrepTime,
    };
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
const getStoreMenuCategories = async (storeId: string) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        menuItems: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    }
    const categoriesData = store.menuItems.map((item) => item.category);
    const categories = categoriesData.filter(
      (category, index, self) =>
        self.findIndex((t) => t.id === category.id) === index
    );
    return categories;
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};
export {
  getStoreMenuItems,
  getStoreMenuCategories,
  getCategories,
  getOptions,
  getChoiceByOptionId,
  createMenuItem,
  getMenuItemsByStoreId,
  getMenuItemById,
  deleteMenuItemById,
  updateMenuItem,
  getFoodTypes,
  addFoodTypeToStore,
  removeFoodTypeFromStore,
  getFoodTypesForStore,
};
