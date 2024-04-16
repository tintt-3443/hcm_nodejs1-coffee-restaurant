import { InvoiceRepository } from '../repository/invoice.repository';
import { PaymentDto } from '../dto/payment/payment.dto';
import { Transactional } from 'typeorm-transactional';
import { CartsService } from './cart.service';
import { InvoiceDetailRepository } from '../repository/invoice-detail.repository';
import { Topping } from '../entities/Topping';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private invoiceDeRepository: InvoiceDetailRepository;
  private cartService: CartsService;
  //create constructor
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
    this.invoiceDeRepository = new InvoiceDetailRepository();
    this.cartService = new CartsService();
  }

  @Transactional()
  public async payment(params: PaymentDto) {
    try {
      const invoice = this.invoiceRepository.create(params);
      await this.invoiceRepository.save(invoice);
      const cart: {
        total: number;
        cartItems: any[];
      } | null = await this.cartService.getCartByUser(params.user_id);

      if (!cart) {
        return null;
      }
      cart?.cartItems.map(async (cartItem) => {
        const invoiceDetail = this.invoiceDeRepository.create({
          up_size: cartItem.productInstance?.size,
          toppingList: cartItem.productInstance?.toppings.map(
            (topping: Topping) => topping?.id,
          ),
          toppingPriceList: cartItem.productInstance?.toppings.map(
            (topping: Topping) => topping?.price,
          ),
          quantity: cartItem.quantity,
          total: cartItem.total,
          invoice: invoice,
          productInstance: cartItem.productInstance,
        });
        await this.invoiceRepository.save(invoiceDetail);
      });
      invoice.total = cart.total;
      await this.invoiceRepository.save(invoice);
      return invoice;
    } catch (error) {
      console.log('err', error);
      return null;
    }
  }
}

// public async payment() {}
