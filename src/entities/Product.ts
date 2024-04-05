import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './Common';
import { InvoiceDetail } from './InvoiceDetail';
import { Type } from './Type';
import { Rating } from './Rating';

@Entity()
export class Product extends Common {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  rating_avg: number;

  @Column()
  rating_overall: number;

  // FOREIGN KEY
  @OneToMany(
    () => InvoiceDetail,
    (invoiceDetail: InvoiceDetail) => invoiceDetail.product,
  )
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(() => Type, (type: Type) => type.products)
  type: Type;

  @ManyToOne(() => Rating, (rating: Rating) => rating.product)
  ratings: Rating[];

  // METHOD

  url(): string {
    return `/products/${this.id}`;
  }
}
