import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/user.service';
import cloudinary from '../config/cloudinary.config';
import { UserChangePassword, UserUpdateDto } from '../dto/user/user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CONSTANT } from '../constant/variable';

const userService = new UserService();

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

      if (result?.url) req.body.avatar = result?.url;
    }
    next();
  } catch (error) {
    req.flash('error', 'user.not-upload-image');
    res.render('user', { message: req.flash('error') });
  }
};

export const updateProfileUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.params?.id);

    const userDto: UserUpdateDto = plainToClass(UserUpdateDto, {
      userId: userId,
      ...req.body,
    });
    const errors_ = await validate(userDto);
    if (errors_.length > 0) {
      const errors = errors_.map((e) => {
        return {
          name: e.property,
          msg: req.t(Object.values({ ...e?.constraints })),
        };
      });
      const user = await userService.getProfileUser(userId);
      res.json({ user, errors, status: false });
      return;
    } else {
      await userService.updateProfileUser(userDto);
      res.json({ status: true });
    }
  } catch (error) {
    req.flash('error', 'user.not-update-profile');
    res.render('user', { message: req.flash('error') });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = Number(req?.params?.id);
    const changePasswordDto: UserChangePassword = plainToClass(
      UserChangePassword,
      {
        userId: userId,
        ...req.body,
      },
    );
    const errors_ = await validate(changePasswordDto);
    if (errors_.length > 0) {
      const errors = errors_.map((e) => {
        return {
          name: e.property,
          msg: req.t(Object.values({ ...e?.constraints })),
        };
      });
      res.json({ errors, status: false });
      return;
    }
    const newPassword = changePasswordDto.newPassword;
    const confirmPassword = changePasswordDto.confirmPassword;
    const errors = [];
    if (newPassword !== confirmPassword) {
      errors.push({
        name: 'confirmPassword',
        msg: req.t('user.user-valid-name/password-not-match'),
      });
    }
    const result = await userService.changePassword(changePasswordDto);
    if (!result) {
      errors.push({
        name: 'oldPassword',
        msg: req.t('user.old-password-incorrect'),
      });
    }
    if (errors.length > 0) {
      res.json({ errors, status: false });
      return;
    } else res.json({ status: true });
  } catch (error) {
    req.flash('error', 'user.not-change-password');
    res.render('user', { message: req.flash('error') });
  }
};
