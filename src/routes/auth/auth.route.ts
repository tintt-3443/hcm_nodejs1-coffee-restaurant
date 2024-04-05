import express from 'express';
const router = express.Router();
import * as authController from '../../controller/auth.controller';

router.get('/register', authController.registerGet);
router.post('/register', authController.postUserCreateForm);
router.get('/login', authController.LoginGet);
router.post('/logout', authController.Logout);

export default router;
