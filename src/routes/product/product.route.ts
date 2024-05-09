import express from 'express';
const router = express.Router();
import * as productController from '../../controller/product.controller';
import * as ratingController from '../../controller/rating.controller';

router.post('/rating', ratingController.createRating);
router.get('/:id', productController.getProductDetail);
router.get('/', productController.getAllProducts);

export default router;
