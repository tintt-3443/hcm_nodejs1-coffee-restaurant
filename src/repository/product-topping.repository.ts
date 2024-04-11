import { ProductInstance } from '../entities/ProductInstance';
import { BaseRepository } from './base.repository';

export class ProductToppingRepository extends BaseRepository<Pro> {
  constructor() {
    super(ProductInstance);
  }
}
