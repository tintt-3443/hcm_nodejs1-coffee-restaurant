import { ParamsAddCartDto, ParamsUpdateCartDto } from '../dto/cart/cart.dto';
import { CartItem } from '../entities/CartItem';
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
    params: ParamsAddCartDto,
  ) {
    try {
      const cartItem = this.cartItemRepository.create({
        cart: { id: idCart },
        productInstance: { id: idProducrI },
        quantity: params.quantity,
        up_size: params.up_size,
        toppingList: params.toppings,
      });
      cartItem ? await this.cartItemRepository.save(cartItem) : null;
    } catch (error) {
      return null;
    }
  }

  public async updateCart(cartItemUpdate: CartItem, quantity: number) {
    try {
      if (quantity < 0) return null;
      await this.cartItemRepository.save({
        ...cartItemUpdate,
        quantity: quantity,
      });
    } catch (error) {
      return null;
    }
  }

  public async UpdateCartByProduct(params: ParamsUpdateCartDto) {
    try {
      const productInstance = await this.cartItemRepository.findOne({
        where: { productInstance: { id: params?.productInstanceId } },
      });
      if (!productInstance) return null;
      const cartItem = await this.cartItemRepository.findOne({
        where: { productInstance: { id: params?.productInstanceId } },
      });
      if (cartItem) {
        const updatedCartItem = await this.cartItemRepository.save({
          ...cartItem,
          quantity: params?.quantity,
        });
        return updatedCartItem;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async checkCartItemExist(
    idCart: number,
    idProductI: number,
    toppings: number[],
    size: boolean,
  ) {
    try {
      const listCartItem = await this.cartItemRepository.find({
        where: {
          cart: { id: idCart },
          up_size: size,
        },
        relations: ['productInstance', 'productInstance.product'],
      });
      if (listCartItem.length === 0) return null;
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

  public async deleteCartByProduct(productInstanceId: number) {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { productInstance: { id: productInstanceId } },
      });
      if (!cartItem) return null;
      await this.cartItemRepository.remove(cartItem);
      return true;
    } catch (error) {
      return null;
    }
  }

  public async deleteCartItemByCart(cartId: number) {
    try {
      const cartItems = await this.cartItemRepository.find({
        where: { cart: { id: cartId } },
      });
      if (cartItems.length === 0) return null;
      await this.cartItemRepository.remove(cartItems);
      return true;
    } catch (error) {
      return null;
    }
  }
}
