import express from 'express';
const router = express.Router();
import * as userController from '../../controller/user.controller';
import { uploadMulter } from '../../middleware/multer/multer.middleware';
import { authenticateJWT } from '../../middleware/auth/auth.middleware';

router.use(authenticateJWT);
router.post(
  '/update/:id',
  uploadMulter.single('file'),
  userController.uploadCloudinary,
  userController.updateProfileUser,
);
router.post('/change-password/:id', userController.changePassword);
router.get('/:id', userController.getProfileUser);

export default router;
