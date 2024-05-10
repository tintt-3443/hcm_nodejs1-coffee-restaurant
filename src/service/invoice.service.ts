import { InvoiceRepository } from '../repository/invoice.repository';
import { PaymentDto } from '../dto/payment/payment.dto';
import { Transactional } from 'typeorm-transactional';
import { CartsService } from './cart.service';
import { InvoiceDetailRepository } from '../repository/invoice-detail.repository';
import { Topping } from '../entities/Topping';
import { ProductInstanceRepository } from '../repository/product-instance';
import { CONSTANT } from '../constant/variable';
import { ProductsService } from './product.service';
import { InvoiceDetail } from '../entities/InvoiceDetail';
import { VNDFormat } from '../utils/auth/helper';
import { STATUS_ORDER } from '../constant/enum';
import { InvoiceAdminDto } from '../dto/admin/admin.dto';
import CronJob from 'node-cron';
import { UserRepository } from '../repository/user.repository';
import { ProductRepository } from '../repository/product.repository';
export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private invoiceDetailRepository: InvoiceDetailRepository;
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private cartService: CartsService;
  private productInstanceRepository: ProductInstanceRepository;
  private productService: ProductsService;
  //create constructor
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
    this.invoiceDetailRepository = new InvoiceDetailRepository();
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.cartService = new CartsService();
    this.productInstanceRepository = new ProductInstanceRepository();
    this.productService = new ProductsService();
  }

  @Transactional()
  public async payment(params: PaymentDto) {
    try {
      const invoiceCreate = this.invoiceRepository.create({
        ...params,
        total: CONSTANT.DEFAULT_TOTAL,
        user: { id: params.user_id },
      });
      const invoice = await this.invoiceRepository.save(invoiceCreate);
      const cart: {
        total: number;
        cartItems: any[];
      } | null = await this.cartService.getCartByUser(params.user_id);

      if (!cart) {
        return null;
      }

      //create invoice detail for invoice
      for (const cartItem of cart.cartItems) {
        const pI = await this.productInstanceRepository.findOne({
          where: { id: cartItem?.productInstance?.idInstance },
        });
        if (!pI) {
          return null;
        }
        const invoiceDetail = this.invoiceDetailRepository.create({
          up_size: cartItem?.up_size,
          price_of_product: cartItem.price,
          toppingList: cartItem?.toppingList,
          toppingPriceList: cartItem.productInstance?.toppings.map(
            (topping: Topping) => topping?.price,
          ),
          quantity: cartItem.quantity,
          total: cartItem.totalProduct,
          invoice: invoice,
          productInstance: pI,
        });

        await this.invoiceDetailRepository.save(invoiceDetail);
      }
      invoice.total = cart.total;
      await this.invoiceRepository.save(invoice);
      await this.cartService.clearCart(params.user_id);
      return invoice;
    } catch (error) {
      return null;
    }
  }

  public async getOrder(userId: number) {
    try {
      const userExist = await this.invoiceRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!userExist) {
        return null;
      }
      const invoices = await this.invoiceRepository.find({
        where: { user: { id: userId } },
      });
      return invoices;
    } catch (error) {
      return null;
    }
  }

  public async getInvoiceDetailByInvoice(invoiceId: number) {
    try {
      const invoiceExist = await this.invoiceRepository.findOne({
        where: { id: invoiceId },
      });
      if (!invoiceExist) {
        return {
          invoice: null,
          invoiceDetails: null,
        };
      }
      const invoiceDetails: InvoiceDetail[] =
        await this.invoiceDetailRepository.find({
          where: { invoice: { id: invoiceId } },
          relations: ['productInstance', 'productInstance.product'],
        });
      if (invoiceDetails) {
        const invoiceDetailFormatPromises = invoiceDetails.map(async (item) => {
          const toppings = await this.productService.getToppingByProduct(
            item?.productInstance?.id,
          );
          return {
            ...item,
            toppings,
            VNDFormat: VNDFormat,
          };
        });

        const invoiceDetailFormat = await Promise.all(
          invoiceDetailFormatPromises,
        );

        return {
          invoice: invoiceExist,
          invoiceDetails: invoiceDetailFormat,
        };
      }
    } catch (error) {
      return null;
    }
  }

  public async updateStatusOrder(invoiceId: number, status: boolean) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId },
      });
      if (!invoice) {
        return null;
      }
      switch (status) {
        case true:
          if (invoice.status === STATUS_ORDER.PENDING) {
            invoice.status = STATUS_ORDER.SHIPPING;
            await this.invoiceRepository.save(invoice);
            return invoice;
          } else if (invoice.status === STATUS_ORDER.SHIPPING) {
            invoice.status = STATUS_ORDER.SUCCESS;
            await this.invoiceRepository.save(invoice);
            return invoice;
          } else return null;
          break;

        case false:
          invoice.status = STATUS_ORDER.REJECT;
          await this.invoiceRepository.save(invoice);
          return invoice;
          break;

        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  //ADMIN
  public async getAllOrders(status?: STATUS_ORDER) {
    try {
      if (status) {
        const invoices = await this.invoiceRepository.find({
          where: { status: status },
        });
        return invoices || [];
      }
      const invoices = await this.invoiceRepository.find();
      return invoices || [];
    } catch (error) {
      return [];
    }
  }

  public async getOrders(options: InvoiceAdminDto) {
    try {
      const query = this.invoiceRepository.createQueryBuilder('invoice');
      if (options.status !== undefined) {
        query.andWhere('invoice.status IN (:...status)', {
          status: [...options.status],
        });
      } else {
        const defaultStatus: STATUS_ORDER[] = [
          STATUS_ORDER.CANCEL,
          STATUS_ORDER.PENDING,
          STATUS_ORDER.SHIPPING,
          STATUS_ORDER.SUCCESS,
          STATUS_ORDER.REJECT,
        ];
        query.andWhere('invoice.status IN (:...status)', {
          status: defaultStatus,
        });
      }
      if (options.startDate && options.endDate) {
        query.andWhere('invoice.created_at BETWEEN :startDate AND :endDate', {
          startDate: options.startDate,
          endDate: options.endDate,
        });
      }
      if (options?.minRange || options?.maxRange) {
        query.andWhere(
          'invoice.total >= :minRange AND invoice.total <= :maxRange',
          {
            minRange: options.minRange || 0,
            maxRange: options.maxRange || Number.MAX_VALUE,
          },
        );
      }

      let order = {};
      if (options.page && options.limit) {
        query.skip((options?.page - 1) * options?.limit);
        query.take(options?.limit);
      }
      order = { created_at: options.sortASC ? 'ASC' : 'DESC' };
      query.orderBy(order);
      const invoices = await query.getMany();

      return invoices || [];
    } catch (error) {
      return [];
    }
  }

  public async statisticRevenue() {
    try {
      const query = this.invoiceRepository
        .createQueryBuilder('invoice')
        .select('MONTH(invoice.updated_at)', 'Month')
        .addSelect('SUM(invoice.total)', 'TotalRevenue')
        .where('YEAR(invoice.updated_at) = :year', { year: 2024 }) // Filter by year
        .groupBy('MONTH(invoice.updated_at)')
        .orderBy('Month', 'ASC');
      const revenues = await query.getRawMany();
      return revenues;
    } catch (error) {
      console.log(error);
    }
  }

  public async getStatistic() {
    try {
      const countsUser = await this.userRepository.count();
      const countProducts = await this.productRepository.count();
      const countInvoices = await this.invoiceRepository.count();
      const orderSuccess = await this.invoiceRepository.count({
        where: { status: STATUS_ORDER.SUCCESS },
      });
      const orderReject = await this.invoiceRepository.count({
        where: { status: STATUS_ORDER.REJECT },
      });
      const revenue = await this.statisticRevenue();
      const statistic = {
        countsUser,
        countProducts,
        countInvoices,
        orderSuccess,
        orderReject,
        revenue,
      };
      return statistic;
    } catch (error) {
      console.log(error);
    }
  }
}
