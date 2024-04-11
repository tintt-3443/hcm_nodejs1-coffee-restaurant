import { IGetAllParams } from 'src/interface/interface';
import { ProductRepository } from '../repository/product.repository';
import { TYPE_PRODUCT } from 'src/constant/enum';
import { Equal } from 'typeorm';

export class ProductsService {
  private productRepository: ProductRepository;
  //create constructor
  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async getAllProducts(params: IGetAllParams) {
    try {
      const products =
        (await this.productRepository.find({
          skip: (params.page - 1) * params.limit,
          take: params.limit,
          loadRelationIds: {
            relations: ['type'],
          },
        })) || [];
      return products;
    } catch (error) {
      return null;
    }
  }

  public async getProductDetail(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        loadRelationIds: {
          relations: ['type'],
        },
      });
      return product;
    } catch (error) {
      return null;
    }
  }

  public async getToppings() {
    try {
      const products = await this.productRepository.find({
        where: { type: Equal(TYPE_PRODUCT.TOPPING) },
        loadRelationIds: {
          relations: ['type'],
        },
      });
      if (products?.length) {
        return null;
      }
      return products;
    } catch (error) {
      return null;
    }
  }
}
