import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './Common';
import { User } from './User';
import { InvoiceDetail } from './InvoiceDetail';
import { Discount } from './Discount';
import { PAYMENT_METHOD, STATUS_ORDER } from '../constant/enum';

@Entity()
export class Invoice extends Common {
  @Column({
    default: false,
  })
  isOnline: boolean;

  @Column()
  total: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column({ type: 'text' })
  note: string;

  @Column({
    type: 'enum',
    enum: PAYMENT_METHOD,
    default: PAYMENT_METHOD.COD,
  })
  payment_method: PAYMENT_METHOD;

  @Column({
    type: 'enum',
    enum: STATUS_ORDER,
    default: STATUS_ORDER.PENDING,
  })
  status: STATUS_ORDER;

  // FOREIGN KEY
  @ManyToOne(() => User, (user: User) => user.invoices)
  user: User;
  @OneToMany(
    () => InvoiceDetail,
    (invoiceDetail: InvoiceDetail) => invoiceDetail.invoice,
  )
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(() => Discount, (discount: Discount) => discount.invoices)
  discount: Discount;

  //METHOD

  url(): string {
    return `/invoices/${this.id}`;
  }
}
