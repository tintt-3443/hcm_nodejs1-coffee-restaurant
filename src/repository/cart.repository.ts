import { Cart } from '../entities/Cart';
import { BaseRepository } from './base.repository';

export class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super(Cart);
  }
}
