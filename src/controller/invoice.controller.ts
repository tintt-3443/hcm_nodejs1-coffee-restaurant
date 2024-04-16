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

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.getOrder(req.session?.user?.id);
    if (!invoice) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
    const invoiceFormat = invoice?.map((item) => {
      return {
        ...item,
        total: VNDFormat(item.total),
        created_at: new Date(item.created_at).toLocaleDateString('vi-VN'),
      };
    });
    res.render('history-order', {
      invoice: invoiceFormat,
      flash: req.flash(),
    });
  } catch (error) {
    req.flash('error', req.t('home.cant-get-product'));
    res.render('product', { flash: req.flash() });
  }
});

export const getInvoiceDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const invoiceId = Number(req.params.id);
      if (!invoiceId) {
        req.flash('error', req.t('home.cant-get-product'));
        res.render('product', { flash: req.flash() });
      }
      const data = await invoiceService.getInvoiceDetailByInvoice(invoiceId);
      if (data?.invoice) {
        const invoiceFormat = {
          ...data.invoice,
          total: VNDFormat(data.invoice.total),
          created_at: new Date(data.invoice.created_at).toLocaleDateString(
            'vi-VN',
          ),
        };
        res.render('history-order/detail', {
          VNDFormat: VNDFormat,
          invoice: invoiceFormat,
          invoiceDetails: data?.invoiceDetails,
          flash: req.flash(),
        });
      }
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);