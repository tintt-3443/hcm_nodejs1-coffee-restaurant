import express from 'express';
const router = express.Router();
import * as adminController from '../../controller/admin/admin.controller';
import {
  authenticateAdmin,
  authenticateJWT,
} from '../../middleware/auth/auth.middleware';
import { uploadMulter } from '../../middleware/multer/multer.middleware';

// router.use(authenticateAdmin);
router.get('/blog/create', adminController.getBlogCreate),
  router.get('/blog', adminController.getBlogs);
router.post(
  '/blog/create',
  uploadMulter.single('file'),
  adminController.uploadCloudinary,
  adminController.createBlog,
),
  router.get('/revenue', authenticateJWT, adminController.statisticRevenue);
router.delete('/product/delete/:id', adminController.deleteProduct);
router.get('/product/create', adminController.createProduct);
router.post(
  '/product/update',
  uploadMulter.single('file'),
  adminController.uploadCloudinary,
  adminController.updateProduct,
);
router.get('/product/:id', authenticateJWT, adminController.getProductDetail);
router.get('/product', authenticateJWT, adminController.getAllProducts);
router.get('/user/:id', authenticateJWT, adminController.getProfileUser);
router.get('/user', authenticateJWT, adminController.getUsers);
router.get('/order', authenticateJWT, adminController.getOrder);
router.get('/order/history/:id', adminController.getInvoiceDetail);
router.get('/', authenticateJWT, adminController.getDashboard);

export default router;
