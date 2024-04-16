import express from 'express';
import authRoute from './auth/auth.route';
import productRoute from './product/product.route';
import cartRoute from './cart/cart.route';
import orderRoute from './order/order.route';
import adminRoute from './admin/admin.route';
import * as productController from '../controller/product.controller';
const router = express.Router();

router.get('/',productController.getProductHomePage);


router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoute);
router.use('/admin', adminRoute);
export default router;
