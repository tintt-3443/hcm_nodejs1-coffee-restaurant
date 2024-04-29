import express from 'express';
const router = express.Router();
import * as cartController from '../../controller/cart.controller';
import {
  authenticateJWT,
  authenticateUser,
} from '../../middleware/auth/auth.middleware';

router.use(authenticateJWT, authenticateUser);
router.get('/', cartController.getCartByUser);
router.post('/add/:id', cartController.addToCart);
router.post('/update/:id', cartController.updateCart);
router.delete('/delete/:id', cartController.deleteCart);

export default router;
