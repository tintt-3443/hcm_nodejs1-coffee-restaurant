import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CartsService } from '../service/cart.service';
import { ParamsAddCart } from '../interface/interface';
import { ProductsService } from '../service/product.service';
import { VNDFormat } from '../utils/auth/helper';
import { CONSTANT } from '../constant/variable';

const cartService = new CartsService();
const productService = new ProductsService();

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

export const getCartByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session?.user?.id;
    if (!userId) {
      req.flash('error', req.t('cart.login-to-get-cart'));
      res.render('product', { flash: req.flash() });
      return;
    }
    const cart = await cartService.getCartByUser(userId);
    res.render('cart', {
      cart,
      VNDFormat,
      MIN_QUANTITY: CONSTANT.MIN_QUANTITY,
      MAX_QUANTITY: CONSTANT.MAX_QUANTITY,
      flash: req.flash(),
    });
  },
);
