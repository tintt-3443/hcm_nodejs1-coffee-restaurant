import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { CartsService } from '../service/cart.service';

let cartService: CartsService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  cartService = new CartsService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('addToCart', () => {
  it('should return cart when add successfully', async () => {
    const params = {
      userId: 1,
      productId: 1,
      quantity: 2,
      toppings: [1, 2],
      up_size: true,
    };
    const cart = await cartService.addToCart(params);
    expect(cart).not.toBeNull();
  });

  it('should return null because quantity less than 0 ', async () => {
    const params = {
      userId: 3,
      productId: 1,
      quantity: -1,
      toppings: [1, 2],
      up_size: false,
    };
    const cart = await cartService.addToCart(params);
    expect(cart).toBeNull();
  });
});

describe('getCartByUser', () => {
  it('should return cart when id of user exist', async () => {
    const userId = 1;
    const cart = await cartService.getCartByUser(userId);
    expect(cart).not.toBeNull();
  });

  it('should return null when user not exist ', async () => {
    const userId = -1;
    const cart = await cartService.getCartByUser(userId);
    expect(cart).toBeNull();
  });
});

describe('clearCart', () => {
  it('should return true when clear cart of user successfully', async () => {
    const userId = 2;
    const cart = await cartService.clearCart(userId);
    expect(cart).toBe(true);
  });

  it('should return false because user not exist ', async () => {
    const userId = 3;
    const cart = await cartService.clearCart(userId);
    expect(cart).toBe(false);
  });
});
