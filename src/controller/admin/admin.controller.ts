import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { InvoiceService } from '../../service/invoice.service';
import {
  VNDFormat,
  createPagination,
  formatDate,
  handleParamsGetAll,
} from '../../utils/auth/helper';
import { ROLE_USER, STATUS_ORDER } from '../../constant/enum';
import { CONSTANT } from '../../constant/variable';
import { InvoiceAdminDto, ProductAdminDto } from '../../dto/admin/admin.dto';
import { plainToClass } from 'class-transformer';
import { isArray, validate } from 'class-validator';
import { UserService } from '../../service/user.service';
import { ICreateBlog, IGetAllParams } from '../../interface/interface';
import { ProductsService } from '../../service/product.service';
import { RatingService } from '../../service/rating.service';
import cloudinary from '../../config/cloudinary.config';
import { BlogService } from '../../service/blog.service';

interface MyQueryParams {
  sortASC?: string;
  status?: string;
  date?: string;
  minRange?: string;
  maxRange?: string;
  page?: number;
  limit?: number;
}

const invoiceService = new InvoiceService();
const userService = new UserService();
const productService = new ProductsService();
const ratingService = new RatingService();
const blogService = new BlogService();
export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const data = await invoiceService.getStatistic();

      if (data) {
        const revenue_ = data?.revenue?.map((item) => {
          return {
            ...item,
            TotalRevenue: VNDFormat(item?.TotalRevenue),
          };
        });
        data.revenue = revenue_;
        res.render('admin', {
          isLoggedIn: true,
          data: data,
          flash: req.flash(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
);
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const paramDto = plainToClass(InvoiceAdminDto, req.query);
    const sortASC = paramDto.sortASC;
    const status_ = paramDto.status;
    const date = paramDto.date;
    const minRange_ = Number(paramDto.minRange);
    const maxRange_ = Number(paramDto.maxRange);
    const page = Number(paramDto?.page) || CONSTANT.PAGE_DEFAULT;
    const paramPagi = handleParamsGetAll({
      page: page,
      limit: paramDto?.limit,
    });

    let statusArray: STATUS_ORDER[] | undefined;

    if (status_ !== undefined) {
      if (Array.isArray(status_)) {
        statusArray = status_.map((status) => status);
      }
    }
    // checktype date
    let startDate_, endDate_: Date | undefined;
    if (date !== undefined) {
      const dateObject = new Date(date);

      const year = dateObject.getFullYear();
      const month = dateObject.getMonth();
      const day = dateObject.getDate();

      startDate_ = new Date(year, month, day, 0, 0, 0, 0);
      endDate_ = new Date(year, month, day, 23, 59, 59, 999);
    }

    const options: InvoiceAdminDto = {
      date: new Date(date),
      status: statusArray,
      startDate: startDate_,
      endDate: endDate_,
      sortASC: sortASC,
      minRange: minRange_,
      maxRange: maxRange_,
      page: paramPagi.page,
      limit: paramPagi.limit,
    };
    const val = validate(options);
    if (isArray(val) && val.length > 0) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('admin/invoice-admin', { flash: req.flash() });
    }
    const invoice = await invoiceService.getOrders(options);
    if (!invoice) {
      req.flash('error', req.t('admin.cant-get-product'));
      res.render('admin/invoice-admin', { flash: req.flash() });
    }
    const invoiceFormat = invoice?.map((item) => {
      return {
        ...item,
        total: VNDFormat(item.total),
        created_at: new Date(item.created_at).toLocaleDateString('vi-VN'),
      };
    });
    res.render('admin/invoice-admin', {
      invoice: invoiceFormat,
      pagination: createPagination(CONSTANT.TOTAL_PAGES, page),
      flash: req.flash(),
    });
  } catch (error) {
    console.log(error);
    req.flash('error', req.t('home.cant-get-product'));
  }
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const defaultParams: IGetAllParams = handleParamsGetAll(params);
    const users = await userService.getAllUsers(defaultParams);
    if (!users) {
      req.flash('error', req.t('admin.cant-get-product'));
      res.render('admin/user-admin', { flash: req.flash() });
    }
    res.render('admin/user-admin', {
      isLoggedIn: true,
      users: users,
      flash: req.flash(),
    });
  } catch (error) {}
});
export const getProfileUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.params?.id);
    const user = await userService.getProfileUser(userId);
    if (user) {
      res.render('user', {
        user,
      });
      return;
    }
    return;
  } catch (error) {
    req.flash('error', 'user.not-get-profile');
    res.render('user', { message: req.flash('error') });
  }
};

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const params = req.query;
      const page = Number(params?.page) || CONSTANT.PAGE_DEFAULT;
      const defaultParams: IGetAllParams = handleParamsGetAll(params);
      const products = await productService.getAllProducts(defaultParams);
      res.render('admin/product-admin', {
        products: products?.map((product) => ({
          ...product,
          price: VNDFormat(product.price),
        })),
        page: defaultParams,
        pagination: createPagination(CONSTANT.TOTAL_PAGES, page),
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);

export const getProductDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;

      const param: IGetAllParams = {
        page: CONSTANT.PAGE_DEFAULT,
        limit: CONSTANT.RELATION_PRODUCT,
      };
      const [product, products, toppings] = await Promise.all([
        productService.getProductDetail(id),
        productService.getAllProducts(param),
        productService.getToppings(),
      ]);
      if (!product) {
        req.flash('error', req.t('home.product-not-found'));
        res.render('product', { flash: req.flash() });
      }
      const filrerProducts = products?.filter((item) => item.id !== id);
      const user_ = req.session?.user?.id;
      const rating = await ratingService.getRating(id);
      const ratings_ = rating?.map((item) => {
        const item_ = {
          ...item,
          dateFormat: formatDate(item.updated_at),
        };
        return item_;
      });
      const statisticRating = await ratingService.statisticRating(id);
      res.render('admin/product-detail-admin', {
        userId: user_,
        product,
        products: filrerProducts?.map((product) => ({ ...product, VNDFormat })),
        toppings: toppings?.map((product) => ({ ...product, VNDFormat })),
        VND: VNDFormat,
        UP_SIZE_PRICE: CONSTANT.UP_SIZE_PRICE,
        ratings: ratings_,
        statisticRating: statisticRating,
      });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);

export const uploadCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;
    if (file) {
      const result = await cloudinary.uploader.upload(file?.path || '', {
        folder: CONSTANT.FOLDER_CLOUDINARY,
      });

      if (result?.url) req.body.image = result?.url;
    }
    next();
  } catch (error) {
    req.flash('error', 'user.not-upload-image');
    res.render('user', { message: req.flash('error') });
  }
};

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const params = req.body;
      const productDto: ProductAdminDto = plainToClass(ProductAdminDto, {
        ...params,
      });
      const errs = await validate(productDto);
      if (errs.length > 0) {
        const errors = errs.map((e) => {
          return {
            name: e.property,
            msg: req.t(Object.values({ ...e?.constraints })),
          };
        });
        res.render('admin/product-detail-admin', { errors });
        return;
      }
      const product = await productService.saveProduct(productDto);
      if (!product) {
        req.flash('error', req.t('home.product-not-found'));
      }

      res.json({ status: 'success' });
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
    }
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    res.render('admin/product-detail-admin');
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      await productService.deleteProduct(id);
      res.json({ status: 'success' });
    } catch (error) {}
  },
);

export const statisticRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const revenue = await invoiceService.statisticRevenue();
      res.json({
        revenue: revenue,
        status: 'success',
      });
    } catch (error) {}
  },
);

export const getBlogCreate = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      res.render('admin/admin-blog-create');
    } catch (error) {}
  },
);

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  try {
    const params: ICreateBlog = {
      title: req.body?.title,
      description: req.body?.description,
      image: req.body?.image,
      content: req.body?.content,
    };
    const errs = await validate(params);
    if (errs.length > 0) {
      const errors = errs.map((e) => {
        return {
          name: e.property,
          msg: req.t(Object.values({ ...e?.constraints })),
        };
      });
      res.render('admin/blog-admin', { errors });
      return;
    }
    const blog = await blogService.createBlog(params);
    if (!blog) {
      req.flash('error', req.t('home.product-not-found'));
    }
    res.json({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
});

export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const page = Number(params?.page) || CONSTANT.PAGE_DEFAULT;
    const defaultParams: IGetAllParams = handleParamsGetAll(params);
    const blogs = await blogService.getBlogs(defaultParams);
    res.render('admin/blog-admin', {
      blogs: blogs,
      page: defaultParams,
      pagination: createPagination(CONSTANT.TOTAL_PAGES, page),
    });
  } catch (error) {}
});

export const getInvoiceDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.session?.user;
      const invoiceId = Number(req.params.id);
      if (!invoiceId) {
        req.flash('error', req.t('home.cant-get-product'));
        res.render('product', { flash: req.flash() });
      }
      const data = await invoiceService.getInvoiceDetailByInvoice(invoiceId);
      if (data?.invoice) {
        const invoiceFormat = {
          ...data.invoice,
          total: VNDFormat(data.invoice.total),
          created_at: new Date(data.invoice.created_at).toLocaleDateString(
            'vi-VN',
          ),
        };
        const compareStatus = (statusA: string, statusB: string) => {
          return statusA == statusB;
        };
        const isAdmin = (role: ROLE_USER) => {
          return role == ROLE_USER.ADMIN;
        };
        const promiseRating = data?.invoiceDetails.map(async (detail) => {
          const rating = await ratingService.getRatingByUser(
            user?.id,
            detail?.productInstance?.product?.id,
          );
          return {
            ...detail,
            rating: rating,
          };
        });

        const invoiceDetails = await Promise.all(promiseRating);

        res.render('history-order/detail', {
          role: req.session?.user?.role,
          isAdmin: isAdmin,
          compareStatus: compareStatus,
          STATUS_ORDER: STATUS_ORDER,
          VNDFormat: VNDFormat,
          invoice: invoiceFormat,
          invoiceDetails: invoiceDetails.map((detail) => ({
            ...detail,
            total: VNDFormat(detail.total),
            price_of_product: VNDFormat(detail.price_of_product),
          })),
          flash: req.flash(),
        });
      }
    } catch (error) {
      req.flash('error', req.t('home.cant-get-product'));
      res.render('product', { flash: req.flash() });
    }
  },
);
