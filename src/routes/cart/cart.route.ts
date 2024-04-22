import express from 'express';
const router = express.Router();
import * as cartController from '../../controller/cart.controller';
import { authenticateJWT } from '../../middleware/auth/auth.middleware';

router.get('/', authenticateJWT, cartController.getCartByUser);
router.post('/add/:id', authenticateJWT, cartController.addToCart);
router.post('/update/:id', authenticateJWT, cartController.updateCart);
router.delete('/delete/:id', authenticateJWT, cartController.deleteCart);

export default router;
