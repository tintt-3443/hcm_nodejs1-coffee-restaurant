import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BlogService } from '../service/blog.service';
import { createPagination, handleParamsGetAll } from '../utils/auth/helper';
import { CONSTANT } from '../constant/variable';
import { IGetAllParams } from '../interface/interface';

const blogService = new BlogService();

export const getBlogDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const blogId = Number(req.params?.id);
      if (isNaN(blogId)) {
        req.flash('error', req.t('blog.not-found'));
        res.render('blog', { flash: req.flash() });
      }
      const blog = await blogService.getBlogById(blogId);
      res.render('blog/detail', {
        blog,
      });
    } catch (error) {
      console.log('err', error);
    }
  },
);

export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const defaultParams: IGetAllParams = handleParamsGetAll(params);
    const blogs = await blogService.getBlogs(defaultParams);
    res.render('blog', {
      blogs,
      pagination: createPagination(CONSTANT.TOTAL_PAGES, 1),
    });
  } catch (error) {
    console.log('err', error);
  }
});

export const updateView = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params?.id);
  if (!isNaN(id)) {
    await blogService.updateView(id);
    res.json({ status: 'success' });
  }
  res.json({ status: 'fail' });
});
