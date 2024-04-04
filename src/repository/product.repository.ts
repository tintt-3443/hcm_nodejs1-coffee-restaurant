import { BaseRepository } from './base.repository';
import { Product } from '../entities/Product';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }
}
