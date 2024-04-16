import express from 'express';
const router = express.Router();
import * as cartController from '../../controller/cart.controller';
import {
  authenticateJWT,
  requireLogin,
} from '../../middleware/auth/auth.middleware';

router.get('/', requireLogin, authenticateJWT, cartController.getCartByUser);
router.post(
  '/add/:id',
  requireLogin,
  authenticateJWT,
  cartController.addToCart,
);
router.post(
  '/update/:id',
  requireLogin,
  authenticateJWT,
  cartController.updateCart,
);
router.delete(
  '/delete/:id',
  requireLogin,
  authenticateJWT,
  cartController.deleteCart,
);

export default router;
