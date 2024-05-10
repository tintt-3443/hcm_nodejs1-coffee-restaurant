import { Column, Entity } from 'typeorm';
import { Common } from './Common';

@Entity()
export class Blog extends Common {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    default: 0,
  })
  view: number;
  // FOREIGN KEY
}
