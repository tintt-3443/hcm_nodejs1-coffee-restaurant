import { NextFunction, Request, Response } from 'express';
import { decodeJWT } from '../../utils/auth/auth';
import { ROLE_USER } from '../../constant/enum';

interface IUserSession {
  user: {
    email: string;
  };
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string = req.cookies.token;
    if (!token) {
      res.redirect('/auth/login');
    }
    const decoded = (await decodeJWT(token)) as IUserSession;
    if (decoded) {
      next();
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.session && req.session?.user?.role === ROLE_USER.ADMIN) {
      next();
    } 
  } catch (error) {
    res.redirect('auth/login');
  }
};


export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.session && req.session?.user?.role == ROLE_USER.USER) {
      next();
    }
 
   
  } catch (error) {
    res.redirect('auth/login');
  }
};
