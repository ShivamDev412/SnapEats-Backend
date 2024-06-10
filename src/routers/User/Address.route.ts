import express from "express";
import { ENDPOINTS } from "../../utils/Endpoints";
import AddressController from "../../controllers/User/Address.controller";
import { AuthMiddleware } from "../../middlewares/Auth.middleware";

const routes = express.Router();
const userAddressController = new AddressController();
routes.get(ENDPOINTS.ADDRESS, AuthMiddleware, userAddressController.address);
routes.post(
  ENDPOINTS.ADDRESS,
  AuthMiddleware,
  userAddressController.createAddress
);
routes.put(
  `${ENDPOINTS.ADDRESS}/:id`,
  AuthMiddleware,
  userAddressController.updateAddress
);
routes.delete(
  `${ENDPOINTS.ADDRESS}/:id`,
  AuthMiddleware,
  userAddressController.deleteAddress
);
routes.put(
  `${ENDPOINTS.MARK_ADDRESS_AS_DEFAULT}/:id`,
  AuthMiddleware,
  userAddressController.markAddressAsDefault
);
export default routes;
