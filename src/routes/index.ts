import express, { Request, Response } from 'express';
import authRoute from './auth/auth.route';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('home');
});

router.use('/auth', authRoute);
export default router;
