import { NextFunction, Request, Response } from 'express';
import { decodeJWT } from '../../utils/auth/auth';

interface IUserSession {
  user: {
    email: string;
  };
}

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('auth/login');
  }
};
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string = req.cookies.token;
    if (!token) {
      res.redirect('auth/login');
    }
    const decoded = (await decodeJWT(token)) as IUserSession;
    if (decoded) {
      if (req.session) {
        req.session.user = decoded?.user;
        next();
      }
    }
  } catch (error) {
    res.redirect('auth/login');
  }
};
