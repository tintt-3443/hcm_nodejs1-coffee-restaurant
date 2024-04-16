import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PaymentDto } from '../dto/payment/payment.dto';
import { InvoiceService } from '../service/invoice.service';
import { CartsService } from '../service/cart.service';
import { VNDFormat } from '../utils/auth/helper';
import { PAYMENT_METHOD } from '../constant/enum';

const invoiceService = new InvoiceService();
const cartService = new CartsService();
export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  try {
    const paramsPayment: PaymentDto = {
      ...req.body,
      user_id: req.session?.user?.id,
      isOnline: false,
      payment_method: PAYMENT_METHOD.COD,
    };

    const invoice = await invoiceService.payment(paramsPayment);
    console.log('invoice', invoice);
    // res.render('order', { invoice, flash: req.flash() });
    res.json({ success: true });
  } catch (error) {
    req.flash('error', req.t('home.cant-get-product'));
    res.render('product', { flash: req.flash() });
  }
});

export const getDefaultInfor = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.session?.user;
      console.log('user', req.session?.user);
      const cart = await cartService.getCartByUser(user?.id);
      res.render('order', {
        user,
        cart,
        VNDFormat: VNDFormat,
        flash: req.flash(),
      });
      // const cart = await invoiceService.getDefaultInfor(userId);
      // res.json({ cart });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);
