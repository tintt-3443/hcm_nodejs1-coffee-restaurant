import { Topping } from '../entities/Topping';
import { BaseRepository } from './base.repository';

export class ToppingRepository extends BaseRepository<Topping> {
  constructor() {
    super(Topping);
  }
}
