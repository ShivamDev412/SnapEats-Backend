import { Request, Response, NextFunction } from "express";
import MenuService from "../../services/Store/Menu.service";
import { deleteMenuItemById } from "../../dbConfig/queries/Store.query";

class MenuController {
  private menuService: MenuService;
  constructor() {
    this.menuService = new MenuService();
  }

  /**
   * @swagger
   * /store/menu/categories:
   *   get:
   *     summary: Get all categories
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully fetched categories
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Category 1", "Category 2"]
   *                 success:
   *                   type: boolean
   *                   example: true
   *       500:
   *         description: Internal server error
   */
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const storeId = req.user?.storeId as string;
      const categories = await this.menuService.getCategories(storeId);
      res.status(200).json({ data: categories, success: true });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * @swagger
   * /store/menu/options:
   *   get:
   *     summary: Get all options
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully fetched options
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Option 1", "Option 2"]
   *                 success:
   *                   type: boolean
   *                   example: true
   *       500:
   *         description: Internal server error
   */
  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await this.menuService.getOptions();
      res.status(200).json({ data: options, success: true });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * @swagger
   * /store/menu/choice/{optionId}:
   *   get:
   *     summary: Get choices for a given option
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: optionId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the option
   *     responses:
   *       200:
   *         description: Successfully fetched choices
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Choice 1", "Choice 2"]
   *                 success:
   *                   type: boolean
   *                   example: true
   *       500:
   *         description: Internal server error
   */
  getChoices = async (req: Request, res: Response, next: NextFunction) => {
    const optionId = req.params.optionId as string;
    try {
      const choices = await this.menuService.getChoices(optionId);
      res.status(200).json({ data: choices, success: true });
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * @swagger
   * /store/menu:
   *   post:
   *     summary: Add a new menu item
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "New Item"
   *               description:
   *                 type: string
   *                 example: "Delicious new item"
   *               basePrice:
   *                 type: number
   *                 example: 10.5
   *               category:
   *                 type: string
   *                 example: "Category ID"
   *               options:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Option 1", "Option 2"]
   *               isVeg:
   *                 type: boolean
   *                 example: true
   *               prepTime:
   *                 type: number
   *                 example: 15
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Menu item added successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Menu item added successfully"
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "menu-item-id"
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /store/menu:
   *   get:
   *     summary: Get all menu items
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         required: false
   *         description: Category ID to filter menu items
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         required: false
   *         description: Search term to filter menu items
   *     responses:
   *       200:
   *         description: Successfully fetched menu items
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "menu-item-id"
   *                       name:
   *                         type: string
   *                         example: "Menu Item Name"
   *                       description:
   *                         type: string
   *                         example: "Description of the menu item"
   *                       basePrice:
   *                         type: number
   *                         example: 10.5
   *                       category:
   *                         type: string
   *                         example: "Category ID"
   *                       isVeg:
   *                         type: boolean
   *                         example: true
   *                       prepTime:
   *                         type: number
   *                         example: 15
   *                 success:
   *                   type: boolean
   *                   example: true
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /store/menu/{menuId}:
   *   get:
   *     summary: Get details of a menu item
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: menuId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the menu item
   *     responses:
   *       200:
   *         description: Successfully fetched menu item details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "menu-item-id"
   *                     name:
   *                       type: string
   *                       example: "Menu Item Name"
   *                     description:
   *                       type: string
   *                       example: "Description of the menu item"
   *                     basePrice:
   *                       type: number
   *                       example: 10.5
   *                     category:
   *                       type: string
   *                       example: "Category ID"
   *                     isVeg:
   *                       type: boolean
   *                       example: true
   *                     prepTime:
   *                       type: number
   *                       example: 15
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /store/menu:
   *   put:
   *     summary: Update a menu item
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               menuId:
   *                 type: string
   *                 example: "menu-item-id"
   *               name:
   *                 type: string
   *                 example: "Updated Item"
   *               description:
   *                 type: string
   *                 example: "Updated description"
   *               basePrice:
   *                 type: number
   *                 example: 12.5
   *               category:
   *                 type: string
   *                 example: "Updated Category ID"
   *               options:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Updated Option 1", "Updated Option 2"]
   *               isVeg:
   *                 type: boolean
   *                 example: false
   *               prepTime:
   *                 type: number
   *                 example: 20
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Menu item updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Menu item updated successfully"
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "menu-item-id"
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /store/menu/{menuId}:
   *   delete:
   *     summary: Delete a menu item
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: menuId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the menu item
   *     responses:
   *       200:
   *         description: Menu item deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Menu item deleted successfully"
   *                 success:
   *                   type: boolean
   *                   example: true
   *       500:
   *         description: Internal server error
   */
  deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId as string;
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
