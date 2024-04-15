import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Common } from './Common';
import { ProductInstance } from './ProductInstance';

@Entity()
export class Topping extends Common {
  @Column()
  name: string;

  @Column()
  price: number;

  // FOREIGN KEY
  @ManyToMany(() => ProductInstance)
  @JoinTable()
  products: ProductInstance[];
}

