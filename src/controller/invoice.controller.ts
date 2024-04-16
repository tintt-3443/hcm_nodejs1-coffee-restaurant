import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PaymentDto } from '../dto/payment/payment.dto';
import { InvoiceService } from '../service/invoice.service';
import { CartsService } from '../service/cart.service';
import { VNDFormat } from '../utils/auth/helper';
import { ROLE_USER, STATUS_ORDER } from '../constant/enum';

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
        const compareStatus = (statusA: string, statusB: string) => { 
          return statusA == statusB;
        };
        const isAdmin = (role: ROLE_USER) => { 
          return role ==  ROLE_USER.ADMIN;
        };
        res.render('history-order/detail', {
    role: req.session?.user?.role,
    isAdmin: isAdmin,
    compareStatus: compareStatus,
    STATUS_ORDER: STATUS_ORDER,
    VNDFormat: VNDFormat,
    invoice: invoiceFormat,
    invoiceDetails: data?.invoiceDetails.map(detail => ({
        ...detail,
        total: VNDFormat(detail.total),
        price_of_product: VNDFormat(detail.price_of_product),
    })),
    flash: req.flash(),
}); 
      }
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);

export const updateStatusOrder = asyncHandler(
  async (req: Request, res: Response) => { 
    try {
      const invoiceId = Number(req.params.id);
      const isProcess = req.body?.status;
      if (!invoiceId || !isProcess) {
        req.flash('error', req.t('home.cant-get-product'));
        res.render('product', { flash: req.flash() });
      }
      await invoiceService.updateStatusOrder(invoiceId, isProcess);
      res.json({ success: true });
    }
     catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }

  });


