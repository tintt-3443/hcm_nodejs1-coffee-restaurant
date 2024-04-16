import { InvoiceRepository } from '../repository/invoice.repository';
import { PaymentDto } from '../dto/payment/payment.dto';
import { Transactional } from 'typeorm-transactional';
import { CartsService } from './cart.service';
import { InvoiceDetailRepository } from '../repository/invoice-detail.repository';
import { Topping } from '../entities/Topping';
import { ProductInstanceRepository } from '../repository/product-instance';
import { CONSTANT } from '../constant/variable';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private invoiceDetailRepository: InvoiceDetailRepository;
  private cartService: CartsService;
  private productInstanceRepository: ProductInstanceRepository;
  //create constructor
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
    this.invoiceDetailRepository = new InvoiceDetailRepository();
    this.cartService = new CartsService();
    this.productInstanceRepository = new ProductInstanceRepository();
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
}
