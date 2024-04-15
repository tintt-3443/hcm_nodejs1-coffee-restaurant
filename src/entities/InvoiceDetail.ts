import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './Common';
import { SIZE_PRODUCT } from '../constant/enum';
import { Invoice } from './Invoice';
import { ProductInstance } from './ProductInstance';

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

  @Column('simple-array')
  toppingList: number[];
  // FOREIGN KEY
  @ManyToOne(
    () => ProductInstance,
    (productInstance: ProductInstance) => productInstance.invoiceDetails,
  )
  productInstance: ProductInstance;

  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.invoiceDetails)
  invoice: Invoice;

  // METHOD
  url(): string {
    return `/invoice-detail/${this.id}`;
  }
}
