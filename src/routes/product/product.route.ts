import express from 'express';
const router = express.Router();
import * as productController from '../../controller/product.controller';

router.get('/', productController.getAllProducts);

export default router;
