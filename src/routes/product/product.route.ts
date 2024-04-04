import express from 'express';
const router = express.Router();
import * as productController from '../../controller/product.controller';

router.get('/:id', productController.getProductDetail);
router.get('/', productController.getAllProducts);

export default router;
