import express, { Request, Response } from 'express';
import authRoute from './auth/auth.route';
import productRoute from './product/product.route';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('home');
});

router.use('/auth', authRoute);
router.use('/product', productRoute);
export default router;
