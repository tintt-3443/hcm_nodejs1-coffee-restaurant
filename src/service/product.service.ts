import { IGetAllParams } from 'src/interface/interface';
import { ProductRepository } from '../repository/product.repository';

export class ProductsService {
  //create constructor
  constructor(private productRepository: ProductRepository) {}

  public async getAllProducts(params: IGetAllParams) {
    try {
      const products =
        (await this.productRepository.find({
          skip: (params.page - 1) * params.limit,
          take: params.limit,
        })) || [];
      return products;
    } catch (error) {
      return null;
    }
  }
}
