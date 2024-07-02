import { Options } from "../../controllers/User/Cart.controller";
class CartService {
  async addToCart(
    userId: string,
    menuItemId: string,
    note: string | undefined,
    options: Options[] | undefined
  ) {}
}
export default CartService;
