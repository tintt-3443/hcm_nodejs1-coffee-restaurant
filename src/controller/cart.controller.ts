import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CartsService } from '../service/cart.service';
import { ProductsService } from '../service/product.service';
import { VNDFormat } from '../utils/auth/helper';
import { CartItemService } from '../service/cartItem.service';
import { ParamsAddCartDto, ParamsUpdateCartDto } from '../dto/cart/cart.dto';

const cartService = new CartsService();
const productService = new ProductsService();
const cartItemService = new CartItemService();

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.session?.user?.id;
    const productId = Number(req.body?.productId);
    const productExist = await productService.checkProductExist(productId);
    if (!productExist) {
      req.flash('error', req.t('cart.cant-add-cart'));
      res.render('product', { flash: req.flash() });
      return;
    }
    const params: ParamsAddCartDto = {
      ...req.body,
      productId,
      userId: userId,
    };
    await cartService.addToCart(params);
    res.render('cart', { VNDFormat: VNDFormat, flash: req.flash() });
  } catch (error) {
    req.flash('error', req.t('cart.cant-add-cart'));
    res.render('product', { flash: req.flash() });
  }
});

export const getCartByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session?.user?.id;
    const cart = await cartService.getCartByUser(userId);
    res.render('cart', {
      cart,
      VNDFormat,
      flash: req.flash(),
    });
  },
);

export const updateCart = asyncHandler(async (req: Request, res: Response) => {
  try {
    const quantity = Number(req.body?.quantity);
    const productInstanceId = Number(req.params?.id);
    const params: ParamsUpdateCartDto = {
      quantity,
      productInstanceId,
    };
    await cartItemService.UpdateCartByProduct(params);

    res.json({ success: true });
  } catch (error) {
    req.flash('error', req.t('cart.cant-update-cart'));
    res.render('cart', { flash: req.flash() });
  }
});

export const deleteCart = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.session?.user;
    if (!user) {
      req.flash('error', req.t('cart.login-to-delete-cart'));
      res.render('cart', { flash: req.flash() });
      return;
    }
    const productInstanceId = Number(req.params?.id);
    if (!productInstanceId) {
      req.flash('error', req.t('cart.cant-delete-cart'));
      res.render('cart', { flash: req.flash() });
      return;
    }
    await cartItemService.deleteCartByProduct(productInstanceId);
    res.json({ success: true });
  } catch (error) {
    req.flash('error', req.t('cart.cant-delete-cart'));
    res.render('cart', { flash: req.flash() });
  }
});
