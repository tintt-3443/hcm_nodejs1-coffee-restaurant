import { Common } from './Common';
import { CartItem } from './CartItem';
import { Topping } from './Topping';
import { Product } from './Product';
import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { InvoiceDetail } from './InvoiceDetail';

@Entity()
export class ProductInstance extends Common {
  @ManyToOne(() => Product, (product: Product) => product.productInstances)
  product: Product;

  @ManyToMany(() => Topping, (topping: Topping) => topping.products)
  @JoinTable()
  toppings: Topping[];

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.productInstance)
  cartItems: CartItem[];
  @OneToMany(
    () => InvoiceDetail,
    (invoiceDetail: InvoiceDetail) => invoiceDetail.productInstance,
  )
  invoiceDetails: InvoiceDetail[];
  // METHOD
  url(): string {
    return `/products/${this.id}`;
  }
}
