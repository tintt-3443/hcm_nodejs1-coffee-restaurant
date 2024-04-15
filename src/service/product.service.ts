import { IGetAllParams } from 'src/interface/interface';
import { ProductRepository } from '../repository/product.repository';
import { ToppingRepository } from '../repository/topping.repository';
import { Product } from '../entities/Product';

export class ProductsService {
  private productRepository: ProductRepository;
  private toppingRepository: ToppingRepository;
  //create constructor
  constructor() {
    this.productRepository = new ProductRepository();
    this.toppingRepository = new ToppingRepository();
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
      const toppings = await this.toppingRepository.find();
      if (toppings?.length < 1) {
        return null;
      }
      return toppings;
    } catch (error) {
      return null;
    }
  }

  public async checkProductExist(productId: number) {
    const productExist = this.productRepository.findOne({
      where: { id: productId },
    });
    return productExist;
  }
}
