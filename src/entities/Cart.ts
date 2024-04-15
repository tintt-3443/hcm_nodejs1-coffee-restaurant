import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Common } from './Common';

import { CartItem } from './CartItem';
import { User } from './User';

@Entity()
export class Cart extends Common {
  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.cart)
  cartItems: CartItem[];

  @OneToOne(() => User, (user: User) => user.cart)
  @JoinColumn()
  user: User;

  @Column()
  total: number;
}
