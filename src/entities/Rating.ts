import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from './Common';
import { User } from './User';
import { Product } from './Product';

@Entity()
export class Rating extends Common {
  @Column()
  comment: string;

  @Column()
  rating_point: number;

  // FOREIGN KEY

  @ManyToOne(() => User, (user: User) => user.ratings)
  user: User;

  @ManyToOne(() => Product, (product: Product) => product.ratings)
  product: Product;

  url(): string {
    return `/user/${this.id}`;
  }
}
