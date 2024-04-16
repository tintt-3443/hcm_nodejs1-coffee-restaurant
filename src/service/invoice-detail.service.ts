import { IGetAllParams } from 'src/interface/interface';
import { InvoiceRepository } from '../repository/invoice.repository';
import { InvoiceDetailRepository } from 'src/repository/invoice-detail.repository';

export class ProductsService {
  private invoiceDetailRepository: InvoiceDetailRepository;
  //create constructor
  constructor() {
    this.invoiceDetailRepository = new InvoiceDetailRepository();
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
}
