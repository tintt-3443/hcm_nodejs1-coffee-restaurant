import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IGetAllParams } from '../interface/interface';
import { ProductsService } from '../service/product.service';
import {
  createPagination,
  handleParamsGetAll,
  VNDFormat,
} from '../utils/auth/helper';
import { CONSTANT } from '../constant/variable';

const productService = new ProductsService();

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  try {
    res.render('order', { flash: req.flash() });
  } catch (error) {
    req.flash('error', req.t('home.cant-get-product'));
    res.render('product', { flash: req.flash() });
  }
});
