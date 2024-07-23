import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import StoreService from "../../services/Store/Store.service";
import { Request, Response, NextFunction } from "express";
import { getStoreById, getStoreByUserId } from "../../dbConfig/queries/Store.query";
import { z } from "zod";
import { StoreProfileSchema } from "../../Schemas/StoreProfile.schema";
import { getImage } from "../../utils/UploadToS3";

class SoreController {
  private storeService: StoreService;
  constructor() {
    this.storeService = new StoreService();
  }
  registerSore = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    try {
      const { name, address, phoneNumber, countryCode, email, lat, lon } =
        req.body;
      const store = await this.storeService.registerStore(
        userId as string,
        name,
        address,
        lat,
        lon,
        phoneNumber,
        countryCode,
        email
      );
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_REQUEST_SEND_SUCCESS,
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  };
  getStoreByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const store = await getStoreById(id as string);

      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_FETCH_SUCCESS,
        success: true,
        data: store ? store : {},
      });
    } catch (error) {
      next(error);
    }
  };
  getStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.storeId;
      const store = await getStoreById(id as string);
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.STORE_FETCH_SUCCESS,
        success: true,
        data: {
          ...store,
          image: store?.image ? await getImage(store?.image) : null,
          compressedImage: store?.compressedImage
            ? await getImage(store?.compressedImage)
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  updateStoreProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, image } = StoreProfileSchema.parse(req.body);
    const file = req.file;
    try {
      const store = await this.storeService.updateUserProfile(
        req.user?.storeId as string,
        name,
        email,
        file,
        image
      );
      res.status(STATUS_CODE.OK).json({
        message: MESSAGES.USER_PROFILE_UPDATED,
        data: store,
        success: true,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ message: error.errors });
      }
      next(error);
    }
  };
}
export default SoreController;
