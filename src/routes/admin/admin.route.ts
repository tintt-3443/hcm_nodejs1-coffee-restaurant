import express from 'express';
const router = express.Router();
import * as adminController from '../../controller/admin/admin.controller';
import {
  authenticateAdmin,
  authenticateJWT,
} from '../../middleware/auth/auth.middleware';

router.use(authenticateAdmin);
router.get('/', authenticateJWT, adminController.getDashboard);

export default router;
