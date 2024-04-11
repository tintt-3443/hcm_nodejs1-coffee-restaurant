import { CartItem } from '../entities/CartItem';
import { BaseRepository } from './base.repository';

export class CartItemRepository extends BaseRepository<CartItem> {
  constructor() {
    super(CartItem);
  }
}
