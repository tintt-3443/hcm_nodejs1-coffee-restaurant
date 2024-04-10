import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CONSTANT } from '../../constant/variable';
const jwtSecret = process.env.ACCESS_TOKEN_SECRET || '';

export const checkPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};

// Method to generate token
export const generateToken = (email: string): string => {
  try {
    const token = jwt.sign({ user: { email } }, 'jwtSecret', {
      expiresIn: CONSTANT.TOKEN_EXPIRATION,
    });
    return token;
  } catch (error) {
    return '';
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const decodeJWT = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
