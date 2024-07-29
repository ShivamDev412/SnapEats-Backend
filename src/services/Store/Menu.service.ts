import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  createMenuItem,
  getCategories,
  getChoiceByOptionId,
  getMenuItemById,
  getMenuItemsByStoreId,
  getOptions,
  updateMenuItem,
} from "../../dbConfig/queries/Store/Menu.query";
import { getStoreById } from "../../dbConfig/queries/Store/Store.query";
import { MESSAGES } from "../../utils/Constant";
import {
  deleteImageFromS3,
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../../utils/UploadToS3";
export type Option = {
  optionId: string;
  isRequired: boolean;
  choice: {
    choiceId: string;
    name: string;
    additionalPrice: number;
  }[];
};
class MenuService {
  async getCategories(storeId: string) {
    const categories = (await getCategories(storeId)).map((category: any) => {
      return {
        value: category.id,
        label: category.name,
        menuCount: category.menuItems.length,
      };
    });
    return categories;
  }
  async getOptions() {
    const options = (await getOptions()).map((option: any) => {
      return {
        value: option.id,
        label: option.name,
      };
    });
    return options;
  }
  async getChoices(optionId: string) {
    const choices = (await getChoiceByOptionId(optionId)).map((choice: any) => {
      return {
        value: choice.id,
        label: choice.name,
      };
    });
    return choices;
  }
  async addMenuitem(
    storeId: string,
    name: string,
    description: string,
    basePrice: string,
    category: string,
    isVeg: boolean,
    prepTime: number,
    options: string,
    file: Express.Multer.File
  ) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    let optionsData: Option[] | undefined;
    if (options)
      optionsData = JSON.parse(options) as {
        optionId: string;
        isRequired: boolean;
        choice: {
          choiceId: string;
          name: string;
          additionalPrice: number;
        }[];
      }[];
    const optionsToSend = optionsData?.map((option) => {
      return {
        optionId: option.optionId,
        isRequired: option.isRequired,
        choice: option.choice.map((choice) => ({
          choiceId: choice.choiceId,
          name: choice.name,
          additionalPrice: choice.additionalPrice,
        })),
      };
    });
    const image = await uploadToS3(name, file?.buffer, file?.mimetype);
    const compressedImage = await uploadCompressedImageToS3(
      name,
      file?.buffer,
      file?.mimetype
    );
    if (!image || !compressedImage) {
      throw new InternalServerError(MESSAGES.IMAGE_ERROR);
    }
    const newMenuItem = await createMenuItem(
      name,
      description,
      basePrice,
      category,
      image,
      compressedImage,
      storeId,
      isVeg,
      prepTime,
      optionsToSend
    );
    return {
      ...newMenuItem,
      image: await getImage(newMenuItem.image as string),
      compressedImage: await getImage(newMenuItem.compressedImage as string),
    };
  }
  async getMenu(storeId: string, categoryId: string | undefined, search: string | undefined) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    const menuItems = await getMenuItemsByStoreId(
      storeId as string,
      categoryId,
      search
    );
    const menuItemsToSend = await Promise.all(
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
    return menuItemsToSend;
  }
  async getMenuById(storeId: string, menuId: string) {
    const menuItem = await getMenuItemById(storeId, menuId);
    if (!menuItem) throw new NotFoundError(MESSAGES.MENU_NOT_FOUND);
    return {
      ...menuItem,
      image: menuItem.image ? await getImage(menuItem.image) : null,
      compressedImage: menuItem.compressedImage
        ? await getImage(menuItem.compressedImage)
        : null,
    };
  }
  async updateMenuitem(
    storeId: string,
    menuId: string,
    name: string,
    description: string,
    basePrice: string,
    category: string,
    isVeg: boolean,
    prepTime: number,
    options: string,
    file: Express.Multer.File,
    image: string
  ) {
    const store = await getStoreById(storeId);
    const menuItem = await getMenuItemById(storeId, menuId);
    let imageToSend;
    let compressedImageToSend;
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);

    let optionsData:
      | {
          optionId: string;
          isRequired: boolean;
          choice: {
            choiceId: string;
            name: string;
            additionalPrice: number;
          }[];
        }[]
      | undefined;

    if (options) {
      try {
        optionsData = JSON.parse(options);
      } catch (error) {
        throw new Error("Invalid options format");
      }
    }
    const optionsToSend = optionsData?.map((option) => ({
      optionId: option.optionId,
      isRequired: option.isRequired,
      choice: option.choice.map((choice) => ({
        choiceId: choice.choiceId,
        name: choice.name,
        additionalPrice: choice.additionalPrice,
      })),
    }));
    if (file) {
      if (menuItem?.image) {
        await deleteImageFromS3(menuItem?.image as string);
      }
      if (menuItem?.compressedImage) {
        await deleteImageFromS3(menuItem?.compressedImage as string);
      }
      imageToSend = await uploadToS3(name, file?.buffer, file?.mimetype);
      compressedImageToSend = await uploadCompressedImageToS3(
        name,
        file?.buffer,
        file?.mimetype
      );
    } else {
      imageToSend = menuItem?.image;
      compressedImageToSend = menuItem?.compressedImage;
    }
    const updatedMenuItem = await updateMenuItem(
      menuId,
      name,
      description,
      basePrice,
      category,
      imageToSend as string,
      compressedImageToSend as string,
      storeId,
      isVeg,
      +prepTime,
      optionsToSend
    );
    return {
      ...updatedMenuItem,
      image: await getImage(updatedMenuItem.image as string),
      compressedImage: await getImage(
        updatedMenuItem.compressedImage as string
      ),
    };
  }
}
export default MenuService;
