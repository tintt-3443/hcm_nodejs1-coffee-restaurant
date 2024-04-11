import { CartItem } from '../entities/CartItem';
import { ParamsAddCart } from '../interface/interface';
import { CartItemRepository } from '../repository/cart-item.repository';

export class CartItemService {
  private cartItemRepository: CartItemRepository;

  //create constructor
  constructor() {
    this.cartItemRepository = new CartItemRepository();
  }

  public async createNewCartItem(
    idCart: number,
    idProducrI: number,
    params: ParamsAddCart,
  ) {
    try {
      const cartItem = this.cartItemRepository.create({
        cart: { id: idCart },
        productInstance: { id: idProducrI },
        quantity: params.quantity,
        up_size: params.size,
        toppingList: params.toppings,
      });
      cartItem ? await this.cartItemRepository.save(cartItem) : null;
    } catch (error) {
      return null;
    }
  }

  public async updateNewCart(cartItemUpdate: CartItem, quantity: number) {
    try {
      await this.cartItemRepository.save({
        ...cartItemUpdate,
        quantity: quantity,
      });
    } catch (error) {
      return null;
    }
  }

  public async checkCartItemExist(
    idCart: number,
    idProductI: number,
    toppings: number[],
  ) {
    try {
      const listCartItem = await this.cartItemRepository.find({
        where: {
          cart: { id: idCart },
        },
        relations: ['productInstance', 'productInstance.product'],
      });
      const cartItem = listCartItem.find((item) => {
        return (
          item.toppingList.toString() == toppings.toString() &&
          item.productInstance.product.id === idProductI
        );
      });
      return cartItem;
    } catch (error) {
      return null;
    }
  }
}
