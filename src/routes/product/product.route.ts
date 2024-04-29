import express from 'express';
const router = express.Router();
import * as productController from '../../controller/product.controller';
import {
  authenticateJWT,
  authenticateUser,
} from '../../middleware/auth/auth.middleware';

router.use(authenticateJWT, authenticateUser);

router.get('/:id', productController.getProductDetail);
router.get('/', productController.getAllProducts);

export default router;
