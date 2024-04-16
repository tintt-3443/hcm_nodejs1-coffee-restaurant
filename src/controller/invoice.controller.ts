import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PaymentDto } from '../dto/payment/payment.dto';
import { InvoiceService } from '../service/invoice.service';
import { CartsService } from '../service/cart.service';
import { VNDFormat } from '../utils/auth/helper';

const invoiceService = new InvoiceService();
const cartService = new CartsService();
export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  try {
    const paramsPayment: PaymentDto = {
      ...req.body,
      user_id: req.session?.user?.id,
    };
    await invoiceService.payment(paramsPayment);
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
      const cart = await cartService.getCartByUser(user?.id);
      res.render('order', {
        user,
        cart,
        VNDFormat: VNDFormat,
        flash: req.flash(),
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);
