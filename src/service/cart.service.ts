import { CartRepository } from '../repository/cart.repository';
import { Transactional } from 'typeorm-transactional';
import { ProductInstanceRepository } from '../repository/product-instance';
import { CartItemService } from './cartItem.service';
import { flatObject, VNDFormat } from '../utils/auth/helper';
import { ProductsService } from './product.service';
import { CONSTANT } from '../constant/variable';
import { ParamsAddCartDto } from '../dto/cart/cart.dto';

export class CartsService {
  private cartItemService: CartItemService;
  private productService: ProductsService;
  private cartRepository: CartRepository;
  private productInstanceRepository: ProductInstanceRepository;

  //create constructor
  constructor() {
    this.cartRepository = new CartRepository();
    this.productInstanceRepository = new ProductInstanceRepository();
    this.cartItemService = new CartItemService();
    this.productService = new ProductsService();
  }

  @Transactional()
  public async addToCart(params: ParamsAddCartDto) {
    try {
      const currentCart = await this.cartRepository.findOne({
        where: { user: { id: params.userId } },
      });
      const cartExist = currentCart
        ? await this.cartItemService.checkCartItemExist(
            currentCart.id,
            params.productId,
            params.toppings,
            params.up_size,
          )
        : null;
      if (currentCart && cartExist) {
        await this.cartItemService.updateCart(
          cartExist,
          1 + cartExist.quantity,
        );
      } else {
        const newCart =
          currentCart ||
          (await this.cartRepository.save({
            user: { id: params.userId },
            total: CONSTANT.DEFAULT_TOTAL,
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

  public async getCartByUser(userId: number) {
    try {
      //get cart and cartItems
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: [
          'cartItems',
          'cartItems.productInstance',
          'cartItems.productInstance.product',
        ],
      });
      //handle calculation cartItems
      const cartItemsPromise = cart?.cartItems.map(async (item) => {
        // get toppings of productInstance
        const toppings = await this.productService.getToppingByProduct(
          item?.productInstance?.id,
        );
        //add VNDFormat
        // calculation price all toppings
        const totalToppingPrice = toppings.reduce((acc, topping) => {
          return acc + topping.price;
        }, 0);
        // calculation total product includes
        //(price product, price toppings, price up_size)
        const totalProduct =
          (item?.productInstance?.product?.price + totalToppingPrice) *
            item?.quantity +
          (item?.up_size ? CONSTANT.UP_SIZE_PRICE : 0);
        // flat object to easy get value
        return {
          ...flatObject(item),
          VNDFormat,
          totalProduct: totalProduct,
          productInstance: {
            idInstance: item.productInstance.id,
            price: item.productInstance.product.price,
            toppings: toppings.map((topping) => ({
              ...flatObject(topping),
              VNDFormat,
            })),
            quantity: item.quantity,
          },
          MIN_QUANTITY: CONSTANT.MIN_QUANTITY,
          MAX_QUANTITY: CONSTANT.MAX_QUANTITY,
        };
      });

      if (cartItemsPromise) {
        const cartItems = await Promise.all(cartItemsPromise);
        // after calculation cartItems , calculation total cart
        const total = cartItems.reduce((acc, item) => {
          return acc + item.totalProduct;
        }, 0);
        const cart = {
          total: total,
          cartItems: cartItems || [],
        };
        return cart;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async clearCart(userId: number) {
    // clear cart
    try {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });
      if (cart) {
        await this.cartItemService.deleteCartItemByCart(cart.id);
      }
    } catch (error) {
      return null;
    }
  }
}
