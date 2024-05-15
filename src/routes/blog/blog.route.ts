import express from 'express';
const router = express.Router();
import * as blogController from '../../controller/blog.controller';

router.post('/view/:id', blogController.updateView);
router.get('/:id', blogController.getBlogDetail);
router.get('/', blogController.getBlogs);

export default router;
