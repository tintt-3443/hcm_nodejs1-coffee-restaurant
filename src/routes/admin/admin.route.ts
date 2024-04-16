import express from 'express';
const router = express.Router();
import * as adminController from '../../controller/admin/admin.controller';
import { authenticateAdmin, authenticateJWT, requireLogin } from '../../middleware/auth/auth.middleware';

router.use(authenticateAdmin);
router.get('/',
    requireLogin,
    authenticateJWT,
    adminController.getDashboard);

export default router;
