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

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const params = req.query;

      const defaultParams: IGetAllParams = handleParamsGetAll(params);
      const products = await productService.getAllProducts(defaultParams);
      res.render('product', {
        products: products?.map((product) => ({ ...product, VNDFormat })),
        page: defaultParams,
        pagination: createPagination(CONSTANT.TOTAL_PAGES, defaultParams.page),
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);

export const getProductDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;

      const param: IGetAllParams = {
        page: CONSTANT.PAGE_DEFAULT,
        limit: CONSTANT.RELATION_PRODUCT,
      };
      const [product, products, toppings] = await Promise.all([
        productService.getProductDetail(id),
        productService.getAllProducts(param),
        productService.getToppings(),
      ]);
      if (!product) {
        req.flash('error', req.t('home.product-not-found'));
        res.render('product', { flash: req.flash() });
      }
      res.render('product/product-detail', {
        product,
        products: products?.map((product) => ({ ...product, VNDFormat })),
        toppings: toppings?.map((product) => ({ ...product, VNDFormat })),
        VND: VNDFormat,
        UP_SIZE_PRICE: CONSTANT.UP_SIZE_PRICE,
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);
