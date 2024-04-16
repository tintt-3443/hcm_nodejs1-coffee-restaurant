import express, { Request, Response } from 'express';
import authRoute from './auth/auth.route';
import productRoute from './product/product.route';
import cartRoute from './cart/cart.route';
import orderRoute from './order/order.route';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('home');
});

router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoute);
export default router;
