import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { InvoiceService } from '../../service/invoice.service';
import { VNDFormat } from '../../utils/auth/helper';


const invoiceService = new InvoiceService();
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceService.getAllOrder();
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
    res.render('admin', {
      invoice: invoiceFormat,
      flash: req.flash(),
    });
  } catch (error) {
    req.flash('error', req.t('home.cant-get-product'));
    res.render('product', { flash: req.flash() });
  }
});


