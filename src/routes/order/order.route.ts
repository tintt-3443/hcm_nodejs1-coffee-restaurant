import express from 'express';
const router = express.Router();
import * as orderController from '../../controller/invoice.controller';
import { authenticateJWT } from '../../middleware/auth/auth.middleware';

router.get('/', authenticateJWT, orderController.getDefaultInfor);
router.get('/history/:id', authenticateJWT, orderController.getInvoiceDetail);
router.post('/update/:id', authenticateJWT, orderController.updateStatusOrder);
router.post('/payment', authenticateJWT, orderController.getPayment);
router.get('/history', authenticateJWT, orderController.getOrder);

export default router;
