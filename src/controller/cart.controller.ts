import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CartsService } from '../service/cart.service';
import { ParamsAddCart } from '../interface/interface';
import { ProductsService } from '../service/product.service';

const cartService = new CartsService();
const productService = new ProductsService();
export const getCart = asyncHandler((req: Request, res: Response) => {
  try {
    res.render('cart', { flash: req.flash() });
  } catch (error) {
    req.flash('error', req.t('cart.cant-get-cart'));
    res.render('product', { flash: req.flash() });
  }
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      req.flash('error', req.t('cart.login-to-add-cart'));
      res.render('product', { flash: req.flash() });
      return;
    }
    const productId = Number(req.body?.productId);
    const productExist = await productService.checkProductExist(productId);
    if (!productExist) {
      req.flash('error', req.t('cart.cant-add-cart'));
      res.render('product', { flash: req.flash() });
      return;
    }
    const params: ParamsAddCart = {
      ...req.body,
      productId,
      userId: userId,
    };
    await cartService.addToCart(params);
    res.render('cart', { flash: req.flash() });
  } catch (error) {
    req.flash('error', req.t('cart.cant-add-cart'));
    res.render('product', { flash: req.flash() });
  }
});
