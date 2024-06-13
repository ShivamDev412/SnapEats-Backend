import { Request, Response, NextFunction } from "express";
import MenuService from "../../services/Store/Menu.service";
import { getMenuItemsByStoreId } from "../../dbConfig/queries/Store.query";

class MenuController {
  menuService: MenuService;
  constructor() {
    this.menuService = new MenuService();
  }
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.menuService.getCategories();
      res.status(200).json({ data: categories, success: true });
    } catch (error: any) {
      next(error);
    }
  };
  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await this.menuService.getOptions();
      res.status(200).json({ data: options, success: true });
    } catch (error: any) {
      next(error);
    }
  };
  getChoices = async (req: Request, res: Response, next: NextFunction) => {
    const optionId = req.params.optionId as string;
    console.log(optionId);
    try {
      const choices = await this.menuService.getChoices(optionId);
      res.status(200).json({ data: choices, success: true });
    } catch (error: any) {
      next(error);
    }
  };
  addMenuitem = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    const { name, description, basePrice, category, options } = req.body;
    const file = req.file as Express.Multer.File;
    try {
      const menuitem = await this.menuService.addMenuitem(
        storeId as string,
        name,
        description,
        basePrice,
        category,
        options,
        file
      );
      res.json({
        message: "Menu item added successfully",
        success: true,
        data: menuitem,
      });
    } catch (error: any) {
      next(error);
    }
  };
  getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    try {
      const menuItems = await getMenuItemsByStoreId(storeId as string);
      res.json({ data: menuItems, success: true });
    } catch (error: any) {
      next(error);
    }
  };
}
export default MenuController;
