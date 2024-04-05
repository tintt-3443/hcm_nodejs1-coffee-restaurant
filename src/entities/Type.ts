import { Column, Entity, OneToOne } from 'typeorm';
import { Common } from './Common';
import { Product } from './Product';

@Entity()
export class Type extends Common {
  @Column()
  name: string;

  // FOREIGN KEY
  @OneToOne(() => Product, (product: Product) => product.type)
  products: Product[];
}
