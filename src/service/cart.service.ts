import { ParamsAddCart } from '../interface/interface';
import { CartRepository } from '../repository/cart.repository';
import { Transactional } from 'typeorm-transactional';
import { ProductInstanceRepository } from '../repository/product-instance';
import { CartItemService } from './cartItem.service';

export class CartsService {
  private cartItemService: CartItemService;
  private cartRepository: CartRepository;
  private productInstanceRepository: ProductInstanceRepository;

  //create constructor
  constructor() {
    this.cartRepository = new CartRepository();
    this.productInstanceRepository = new ProductInstanceRepository();
    this.cartItemService = new CartItemService();
  }

  @Transactional()
  public async addToCart(params: ParamsAddCart) {
    try {
      const currentCart = await this.cartRepository.findOne({
        where: { user: { id: params.userId } },
      });
      const cartExist = currentCart
        ? await this.cartItemService.checkCartItemExist(
            currentCart.id,
            params.productId,
            params.toppings,
          )
        : null;
      if (currentCart && cartExist) {
        await this.cartItemService.updateNewCart(
          cartExist,
          1 + cartExist.quantity,
        );
      } else {
        const newCart =
          currentCart ||
          (await this.cartRepository.save({
            user: { id: params.userId },
          }));
        const productInstance = await this.productInstanceRepository.save({
          product: { id: params.productId },
          toppings: params.toppings.map((id) => ({ id })),
        });
        if (newCart && productInstance) {
          await this.cartItemService.createNewCartItem(
            newCart.id,
            productInstance.id,
            params,
          );
        }
      }
    } catch (error) {
      return null;
    }
  }
}
