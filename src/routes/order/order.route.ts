import express from 'express';
const router = express.Router();
import * as orderController from '../../controller/invoice.controller';

router.get('/', orderController.getDefaultInfor);
router.post('/payment', orderController.getPayment);

export default router;
