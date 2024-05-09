import { Brackets } from 'typeorm';
import { IGetAllParams } from '../interface/interface';
import { ProductRepository } from '../repository/product.repository';
import { ToppingRepository } from '../repository/topping.repository';
import { ProductAdminDto } from '../dto/admin/admin.dto';
import { CONSTANT } from '../constant/variable';

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
      const keywords = params?.keyword;
      const query = this.productRepository
        .createQueryBuilder('product')
        .select();
      if (keywords) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('MATCH(product.name) AGAINST( :keyword IN BOOLEAN MODE)', {
              keyword: keywords + '*',
            }).orWhere(
              'MATCH(product.description) AGAINST(:keyword IN BOOLEAN MODE)',
              {
                keyword: keywords + '*',
              },
            );
          }),
        );
      }
      if (params?.minRange || params?.maxRange) {
        query.andWhere(
          'product.price >= :minRange AND product.price <= :maxRange',
          {
            minRange: params.minRange || 0,
            maxRange: params.maxRange || Number.MAX_VALUE,
          },
        );
      }

      query.leftJoinAndSelect('product.type', 'type');
      if (params?.typeId) {
        query.andWhere('type.id = :typeId', { typeId: params.typeId });
      }
      query.andWhere('product.isActive = true');
      const products = await query
        .orderBy('product.id', 'DESC')
        .limit(params.limit)
        .offset((params.page - 1) * params.limit)
        .getMany();
      return products;
    } catch (error) {
      return null;
    }
  }

  public async getProductDetail(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id, isActive: true },
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

  public getToppingByProduct(productId: number) {
    const toppings = this.toppingRepository.find({
      where: { products: { id: productId } },
    });
    return toppings;
  }

  public async checkProductExist(productId: number) {
    const productExist = this.productRepository.findOne({
      where: { id: productId },
    });
    return productExist;
  }
  public async saveProduct(params: ProductAdminDto) {
    try {
      const id = params?.productId;
      const product = await this.productRepository.findOne({
        where: { id: id, isActive: true },
      });

      if (product && product.id === id) {
        const productUpdated = this.productRepository.create({
          id: product.id,
          ...params,
        });
        await this.productRepository.save(productUpdated);
        return true;
      }
      await this.productRepository.save({
        ...product,
        ...params,
      });
      return true;
    } catch (error) {
      console.log('Error update product', error);
      return null;
    }
  }

  public async deleteProduct(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (product) {
        await this.productRepository.save({
          ...product,
          isActive: false,
        });
        return product;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async getProductDefaultPage() {
    try {
      const query = this.productRepository
        .createQueryBuilder('product')
        .select();
      query.orderBy('rating_avg', 'DESC');
      query.limit(CONSTANT.DEFAULT_PRODUCT_HOMEPAGE);
      const products = await query.getMany();
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
