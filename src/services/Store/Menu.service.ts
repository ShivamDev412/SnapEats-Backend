import { InternalServerError, NotFoundError } from "../../utils/Error";
import {
  createMenuItem,
  getCategories,
  getChoiceByOptionId,
  getOptions,
  getStoreById,
} from "../../dbConfig/queries/Store.query";
import { MESSAGES } from "../../utils/Constant";
import {
  getImage,
  uploadCompressedImageToS3,
  uploadToS3,
} from "../../utils/UploadToS3";
export type Option = {
  optionId: string;
  choice: {
    choiceId: string;
    name: string;
    additionalPrice: number;
  }[];
};
class MenuService {
  async getCategories() {
    const categories = (await getCategories()).map((category: any) => {
      return {
        value: category.id,
        label: category.name,
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
    options: string,
    file: Express.Multer.File
  ) {
    const store = await getStoreById(storeId);
    if (!store) throw new NotFoundError(MESSAGES.STORE_NOT_FOUND);
    let optionsData: Option[] | undefined;
    if (options)
      optionsData = JSON.parse(options) as {
        optionId: string;
        choice: {
          choiceId: string;
          name: string;
          additionalPrice: number;
        }[];
      }[];
    const optionsToSend = optionsData?.map((option) => {
      return {
        optionId: option.optionId,
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
      optionsToSend
    );
    return {
      ...newMenuItem,
      image: await getImage(newMenuItem.image as string),
      compressedImage: await getImage(newMenuItem.compressedImage as string),
    };
  }
}
export default MenuService;
