import express from 'express';
const router = express.Router();
import * as cartController from '../../controller/cart.controller';

router.get('/', cartController.getCart);
router.post('/add/:id', cartController.addToCart);

export default router;
