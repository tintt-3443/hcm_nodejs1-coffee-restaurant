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
      const page = Number(params?.page) || CONSTANT.PAGE_DEFAULT;
      const defaultParams: IGetAllParams = handleParamsGetAll(params);
      const products = await productService.getAllProducts(defaultParams);
      res.render('product', {
        products: products?.map((product) => ({ ...product, VNDFormat })),
        page: defaultParams,
        pagination: createPagination(CONSTANT.TOTAL_PAGES, page),
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
      const filrerProducts = products?.filter((item) => item.id !== id);
      const user_ =  req.session?.user?.id;
      res.render('product/product-detail', {
        userId: user_,
        product,
        products: filrerProducts?.map((product) => ({ ...product, VNDFormat })),
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

export const  getProductHomePage = asyncHandler(async (req: Request, res: Response) => { 
  try {
    const defaultParams: IGetAllParams = handleParamsGetAll({
      page: CONSTANT.PAGE_DEFAULT,
      limit: CONSTANT.PRODUCT_DEFAULT_HPAGE,
    
    });
    const products = await productService.getAllProducts(defaultParams);
      res.render('home', {
        products: products?.map((product) => ({ ...product, VNDFormat })),
      });
  } catch (error) {
    req.flash('error', req.t('home.cant-get-product'));
    res.render('home', { flash: req.flash() });
  }
});
