import express from 'express';
const router = express.Router();
import * as orderController from '../../controller/invoice.controller';
import {
  authenticateJWT,
  authenticateUser,
} from '../../middleware/auth/auth.middleware';

router.use(authenticateJWT, authenticateUser);

router.get('/', orderController.getDefaultInfor);
router.get('/history/:id', orderController.getInvoiceDetail);
router.post('/update/:id', orderController.updateStatusOrder);
router.post('/payment', orderController.getPayment);
router.get('/history', orderController.getOrder);

export default router;
