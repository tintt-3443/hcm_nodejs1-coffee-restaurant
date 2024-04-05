import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './Common';
import { SIZE_PRODUCT } from '../constant/enum';
import { Product } from './Product';
import { Invoice } from './Invoice';

@Entity()
export class InvoiceDetail extends Common {
  @Column({
    nullable: true,
    type: 'enum',
    enum: SIZE_PRODUCT,
    default: SIZE_PRODUCT.M,
  })
  size: SIZE_PRODUCT;
  @Column()
  topping: number;

  @Column()
  price_of_topping: number;

  @Column()
  price_of_product: number;

  @Column()
  quantity: number;

  @Column()
  total: number;

  // FOREIGN KEY
  @ManyToOne(() => Product, (product: Product) => product.invoiceDetails)
  product: Product;

  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.invoiceDetails)
  invoice: Invoice;

  // METHOD
  url(): string {
    return `/invoice-detail/${this.id}`;
  }
}
