import { Request, Response, NextFunction } from "express";
import MenuService from "../../services/Store/Menu.service";
import { deleteMenuItemById } from "../../dbConfig/queries/Store.query";

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
    try {
      const choices = await this.menuService.getChoices(optionId);
      res.status(200).json({ data: choices, success: true });
    } catch (error: any) {
      next(error);
    }
  };
  addMenuitem = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    const { name, description, basePrice, category, options, isVeg, prepTime } =
      req.body;
    const file = req.file as Express.Multer.File;
    try {
      const menuitem = await this.menuService.addMenuitem(
        storeId as string,
        name,
        description,
        basePrice,
        category,
        isVeg === "true" ? true : false,
        +prepTime,
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
    const categoryId = req.query.category as string;
    const search = req.query.search as string;
    try {
      const menuToSend = await this.menuService.getMenu(
        storeId as string,
        categoryId,
        search
      );
      res.json({
        data: menuToSend || [],
        success: true,
      });
    } catch (error: any) {
      next(error);
    }
  };
  getMenuItemDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const storeId = req.user?.storeId;
    const menuId = req.params.menuId as string;
    try {
      const menuitem = await this.menuService.getMenuById(
        storeId as string,
        menuId
      );
      res.json({
        data: menuitem,
        success: true,
      });
    } catch (error: any) {
      next(error);
    }
  };
  updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.user?.storeId;
    const {
      name,
      description,
      basePrice,
      category,
      options,
      isVeg,
      prepTime,
      image,
      menuId,
    } = req.body;
    const file = req.file as Express.Multer.File;
    try {
      const menuitem = await this.menuService.updateMenuitem(
        storeId as string,
        menuId,
        name,
        description,
        basePrice,
        category,
        isVeg === "true" ? true : false,
        +prepTime,
        options,
        file,
        image
      );
      res.json({
        message: "Menu item updated successfully",
        success: true,
        data: menuitem,
      });
    } catch (error: any) {
      next(error);
    }
  };
  deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId as string;
    console.log(menuId, "menuIdd");
    try {
      await deleteMenuItemById(menuId);
      res.json({
        message: "Menu item deleted successfully",
        success: true,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
export default MenuController;
