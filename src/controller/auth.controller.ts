import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';
import { body, validationResult } from 'express-validator';
import { generateToken } from '../utils/auth/auth';
import { validationForm } from '../constant/validate.regex';
import { AuthService } from '../service/auth.service';
import { UserRegisterDto } from '../dto/auth/user_register.dto';

const authService = new AuthService();

export const registerGet = asyncHandler((req: Request, res: Response) => {
  res.render('auth/register', { isLoggedIn: true });
});

export const postUserCreateForm = [
  body('name', 'Name must be specified.')
    .trim()
    .isLength({ min: validationForm.NAME_MIN_LENGTH })
    .withMessage(() => String(i18next.t('auth.user-invalid-name')))
    .escape(),
  body('email', 'Family name must be specified.')
    .trim()
    .isLength({ min: validationForm.EMAIL_MIN_LENGTH })
    .withMessage(() => String(i18next.t('auth.user-invalid-email')))
    .matches(validationForm.EMAIL_REGEX)
    .withMessage(() => String(i18next.t('auth.user-invalid-email')))
    .escape(),
  body('password', 'Invalid password')
    .matches(validationForm.PASSWORD_REGEX)
    .withMessage(() => String(i18next.t('auth.user-invalid-password')))
    .escape(),
  body('repassword', 'Invalid password')
    .optional({ checkFalsy: true })
    .escape(),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const { password, repassword } = req.body;
      if (!errors.isEmpty()) {
        res.render('auth/register', {
          errors: errors.array(),
        });
        return;
      }
      if (password !== repassword) {
        res.render('auth/register', {
          errors: [{ msg: req.t('auth.repassword-not-match') }],
        });
      }
      const userDTO: UserRegisterDto = req.body;
      const userCreated = await authService.RegisterUser(userDTO);
      if (!userCreated) {
        req.flash('error', req.t('home.cant-create'));
        res.redirect('/auth/register');
      }
      res.redirect('/auth/login');
    } catch (error) {
      req.flash('error', req.t('home.cant-create'));
      res.redirect('/auth/login');
    }
  }),
];

export const LoginGet = asyncHandler((req: Request, res: Response) => {
  res.render('auth/signin', { isLoggedIn: true });
});

export const Login = [
  body('email', 'Family name must be specified.')
    .trim()
    .isLength({ min: validationForm.EMAIL_MIN_LENGTH })
    .withMessage(() => String(i18next.t('auth.user-invalid-email')))
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage(() => String(i18next.t('auth.user-invalid-email')))
    .escape(),
  body('password', 'Invalid password').escape(),
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('auth/signin', {
          errors: errors.array(),
        });
        return;
      }
      const user_ = await authService.LoginUser(req.body);
      if (!user_) {
        req.flash('error', req.t('auth.login-fail'));
        res.render('auth/signin', {
          errors: [{ msg: req.t('auth.login-fail') }],
        });
        return;
      }
      //except password
      req.session.user = {
        ...user_,
        password: undefined,
      };
      const token = generateToken(user_.email);
      //set cookie
      res.cookie('token', token);
      res.redirect('/');
    } catch (error) {
      req.flash('error', req.t('home.cant-create'));
      res.redirect('/auth/register');
    }
  }),
];

export const Logout = asyncHandler((req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      req.flash('error', req.t('home.logout-fail'));
    }
  });
  res.clearCookie('token');
  res.json({ success: true });
});
