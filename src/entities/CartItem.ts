import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from './Common';
import { Cart } from './Cart';
import { ProductInstance } from './ProductInstance';

@Entity()
export class CartItem extends Common {
  @Column()
  quantity: number;

  @Column()
  up_size: boolean;

  // FOREIGN KEY
  @ManyToOne(
    () => ProductInstance,
    (productInstance: ProductInstance) => productInstance.cartItems,
  )
  productInstance: ProductInstance;

  @ManyToOne(() => Cart, (cart: Cart) => cart.cartItems)
  cart: Cart;

  @Column('simple-array')
  toppingList: number[];

  // METHOD
  url(): string {
    return `/cart/${this.id}`;
  }
}
