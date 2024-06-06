import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODE } from "../../utils/Constant";
import {
  deleteAddress,
  getUserAddressById,
} from "../../dbConfig/queries/User.query";
import { Address } from "@prisma/client";
import AddressService from "../../services/User/Address.service";
class AddressController {
  addressService: AddressService;
  constructor() {
    this.addressService = new AddressService();
  }
  address = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const address = await getUserAddressById(userId as string);
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: address,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/address:
   *   post:
   *     summary: Create a new address
   *     tags: [Address]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Address'
   *     responses:
   *       200:
   *         description: Successfully created address
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Address'
   *                 message:
   *                   type: string
   */
  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const address = req.body as Address;
    try {
      const newAddress = await this.addressService.createAddress(
        userId as string,
        address
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: newAddress,
        message: MESSAGES.ADDRESS_CREATED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/address/{id}:
   *   put:
   *     summary: Update an address
   *     tags: [Address]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The address ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Address'
   *     responses:
   *       200:
   *         description: Successfully updated address
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Address'
   *                 message:
   *                   type: string
   */
  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const addressId = req.params.id;
    const address = req.body as Address;
    try {
      const updatedAddress = await this.addressService.updateAddress(
        userId as string,
        addressId as string,
        address
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedAddress,
        message: MESSAGES.ADDRESS_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/address/{id}:
   *   delete:
   *     summary: Delete an address
   *     tags: [Address]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The address ID
   *     responses:
   *       200:
   *         description: Successfully deleted address
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   */
  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    const addressId = req.params.id;
    console.log(addressId);
    try {
      await deleteAddress(addressId);
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: MESSAGES.ADDRESS_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @swagger
   * /user/address/default/{id}:
   *   put:
   *     summary: Mark an address as default
   *     tags: [Address]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The address ID
   *     responses:
   *       200:
   *         description: Successfully marked address as default
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Address'
   *                 message:
   *                   type: string
   */
  markAddressAsDefault = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
      const updatedAddress = await this.addressService.markAddressAsDefault(
        userId as string,
        id
      );
      res.status(STATUS_CODE.OK).json({
        success: true,
        data: updatedAddress,
        message: MESSAGES.ADDRESS_MARKED_AS_DEFAULT,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default AddressController;
