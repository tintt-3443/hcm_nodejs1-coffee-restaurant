import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { CartItemService } from '../service/cartItem.service';

let cartItemService: CartItemService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  cartItemService = new CartItemService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('createNewCartItem', () => {
  it('should return cartItem when created successfully', async () => {
    const params = {
      idCart: 2,
      idProducrI: 2,
      userId: 1,
      productId: 1,
      quantity: 2,
      toppings: [1, 2],
      up_size: true,
    };
    const cartItem = await cartItemService.createNewCartItem(
      params.idCart,
      params.idProducrI,
      params,
    );
    expect(cartItem).not.toBeNull();
  });

  it('should return null because quantity less than 0 ', async () => {
    const params = {
      idCart: 1,
      idProducrI: 1,
      userId: 1,
      productId: 1,
      quantity: -2,
      toppings: [1, 2],
      up_size: true,
    };
    const cartItem = await cartItemService.createNewCartItem(
      params.idCart,
      params.idProducrI,
      params,
    );
    expect(cartItem).toBeNull();
  });
});

describe('updateCart', () => {
  it('should return cartItem when id of user and id of product exist', async () => {
    const params = {
      idCart: 2,
      idProducrI: 2,
      userId: 1,
      productId: 1,
      quantity: 2,
      toppings: [1, 2],
      up_size: true,
    };
    const cartItem = await cartItemService.createNewCartItem(
      params.idCart,
      params.idProducrI,
      params,
    );
    expect(cartItem).not.toBeNull();
    if (cartItem) {
      const cartItemUpdate = await cartItemService.updateCart(
        cartItem,
        params.quantity + 1,
      );

      expect(cartItemUpdate).not.toBeNull();
    }
  });

  it('should return null because quantity less than 0 ', async () => {
    const params = {
      idCart: 2,
      idProducrI: 2,
      userId: 1,
      productId: 1,
      quantity: 2,
      toppings: [1, 2],
      up_size: true,
    };
    const cartItem = await cartItemService.createNewCartItem(
      params.idCart,
      params.idProducrI,
      params,
    );
    expect(cartItem).not.toBeNull();
    if (cartItem) {
      const cartItemUpdate = await cartItemService.updateCart(cartItem, -10);

      expect(cartItemUpdate).toBeNull();
    }
  });
});

describe('UpdateCartByProduct', () => {
  it('should return cartItem when id of instance product exist', async () => {
    const params = {
      productInstanceId: 2,
      quantity: 2,
    };
    const cartItemUpdated = await cartItemService.UpdateCartByProduct(params);
    expect(cartItemUpdated).not.toBeNull();
  });

  it('should return null when id of instance product not exist ', async () => {
    const params = {
      productInstanceId: -11,
      quantity: 2,
    };
    const cartItemUpdated = await cartItemService.UpdateCartByProduct(params);
    expect(cartItemUpdated).toBeNull();
  });
});

describe('checkCartItemExist', () => {
  it('should return cartItem when cart exist', async () => {
    const params = {
      idCart: 2,
      idProductI: 2,
      toppings: [1, 2],
      size: true,
    };
    const cartItem = await cartItemService.checkCartItemExist(
      params.idCart,
      params.idProductI,
      params.toppings,
      params.size,
    );
    expect(cartItem).not.toBeNull();
  });

  it('should return null when cartItem not exist ', async () => {
    const params = {
      idCart: -1,
      idProductI: 1,
      toppings: [1, 2],
      size: true,
    };
    const cartItem = await cartItemService.checkCartItemExist(
      params.idCart,
      params.idProductI,
      params.toppings,
      params.size,
    );
    expect(cartItem).toBeNull();
  });
});

describe('deleteCartByProduct', () => {
  it('should return true when deleted successfully', async () => {
    const productInstanceId = 2;
    const cartItem = await cartItemService.deleteCartByProduct(
      productInstanceId,
    );
    expect(cartItem).toBe(true);
  });

  it('should return false when instance product not exist ', async () => {
    const productInstanceId = -1;
    const cartItem = await cartItemService.deleteCartByProduct(
      productInstanceId,
    );
    expect(cartItem).toBeNull();
  });
});

describe('deleteCartItemByCart', () => {
  it('should return true when cart exist', async () => {
    const cartId = 3;
    const cartItem = await cartItemService.deleteCartItemByCart(cartId);
    expect(cartItem).toBe(true);
  });

  it('should return false when cart not exist ', async () => {
    const cartId = -1;
    const cartItem = await cartItemService.deleteCartItemByCart(cartId);
    expect(cartItem).toBeNull();
  });
});
