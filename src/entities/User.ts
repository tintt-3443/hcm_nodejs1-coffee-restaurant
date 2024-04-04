import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from './Common';
import { ROLE_USER, SEX_USER } from '../constant/enum';
import { Invoice } from './Invoice';
import { Rating } from './Rating';

@Entity()
export class User extends Common {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ROLE_USER,
    default: ROLE_USER.USER,
  })
  role: ROLE_USER;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  //sex
  @Column({
    nullable: true,
    type: 'enum',
    enum: SEX_USER,
    default: SEX_USER.MALE,
  })
  sex: SEX_USER;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Rating, (rating: Rating) => rating.user)
  ratings: Rating[];

  // METHOD

  url(): string {
    return `/user/${this.id}`;
  }
}
