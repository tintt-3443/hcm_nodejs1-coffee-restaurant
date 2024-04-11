import { ProductInstance } from '../entities/ProductInstance';
import { BaseRepository } from './base.repository';

export class ProductInstanceRepository extends BaseRepository<ProductInstance> {
  constructor() {
    super(ProductInstance);
  }
}
