import express from 'express';
const router = express.Router();
import * as orderController from '../../controller/invoice.controller';
import {
  authenticateJWT,
  requireLogin,
} from '../../middleware/auth/auth.middleware';

router.get('/', requireLogin, authenticateJWT, orderController.getDefaultInfor);
router.get(
  '/history/:id',
  requireLogin,
  authenticateJWT,
  orderController.getInvoiceDetail,
);
router.post('/update/:id',
  requireLogin,
  authenticateJWT,
  orderController.updateStatusOrder);
router.post(
  '/payment',
  requireLogin,
  authenticateJWT,
  orderController.getPayment,
);
router.get('/history', requireLogin, authenticateJWT, orderController.getOrder);

export default router;
