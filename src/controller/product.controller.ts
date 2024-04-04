import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IGetAllParams } from '../interface/interface';
import { ProductsService } from '../service/product.service';
import { createPagination, handleParamsGetAll } from '../utils/auth/helper';
import { CONSTANT } from '../constant/variable';

const productService = new ProductsService();

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const params = req.query;

      const defaultParams: IGetAllParams = handleParamsGetAll(params);
      const products = await productService.getAllProducts(defaultParams);
      res.render('product', {
        products,
        page: defaultParams,
        pagination: createPagination(CONSTANT.TOTAL_PAGES, defaultParams.page),
      });
    } catch (error) {
      req.flash('error', 'Can not get products');
      res.render('product', { flash: req.flash() });
    }
  },
);
