import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './Common';
import { Invoice } from './Invoice';

@Entity()
export class Discount extends Common {
  @Column()
  name: string;

  @Column()
  percentage: number;

  @Column({ type: 'date', nullable: true })
  start_at: Date;
  @Column({ type: 'date', nullable: true })
  end_at: Date;

  // FOREIGN KEY
  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.discount)
  invoices: Invoice[];

  url(): string {
    return `/discount/${this.id}`;
  }
}
