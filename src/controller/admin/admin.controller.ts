import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { InvoiceService } from '../../service/invoice.service';
import {
  VNDFormat,
  createPagination,
  handleParamsGetAll,
} from '../../utils/auth/helper';
import { STATUS_ORDER } from '../../constant/enum';
import { CONSTANT } from '../../constant/variable';
import { InvoiceAdminDto } from '../../dto/admin/admin.dto';
import { plainToClass } from 'class-transformer';
import { isArray, validate } from 'class-validator';

interface MyQueryParams {
  sortASC?: string;
  status?: string;
  date?: string;
  minRange?: string;
  maxRange?: string;
  page?: number;
  limit?: number;
}

const invoiceService = new InvoiceService();
export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const paramDto = plainToClass(InvoiceAdminDto, req.query);
      const sortASC = paramDto.sortASC;
      const status_ = paramDto.status;
      const date = paramDto.date;
      const minRange_ = Number(paramDto.minRange);
      const maxRange_ = Number(paramDto.maxRange);
      const page = Number(paramDto?.page) || CONSTANT.PAGE_DEFAULT;
      const paramPagi = handleParamsGetAll({
        page: page,
        limit: paramDto?.limit,
      });

      let statusArray: STATUS_ORDER[] | undefined;

      if (status_ !== undefined) {
        if (Array.isArray(status_)) {
          statusArray = status_.map((status) => status);
        }
      }
      // checktype date
      let startDate_, endDate_: Date | undefined;
      if (date !== undefined) {
        const dateObject = new Date(date);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth();
        const day = dateObject.getDate();

        startDate_ = new Date(year, month, day, 0, 0, 0, 0);
        endDate_ = new Date(year, month, day, 23, 59, 59, 999);
      }

      const options: InvoiceAdminDto = {
        date: new Date(date),
        status: statusArray,
        startDate: startDate_,
        endDate: endDate_,
        sortASC: sortASC,
        minRange: minRange_,
        maxRange: maxRange_,
        page: paramPagi.page,
        limit: paramPagi.limit,
      };
      const val = validate(options);
      if (isArray(val) && val.length > 0) {
        req.flash('error', req.t('home.cant-get-product'));
        res.render('admin', { flash: req.flash() });
      }
      const invoice = await invoiceService.getOrders(options);
      if (!invoice) {
        req.flash('error', req.t('admin.cant-get-product'));
        res.render('admin', { flash: req.flash() });
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
        pagination: createPagination(CONSTANT.TOTAL_PAGES, page),

        flash: req.flash(),
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);
