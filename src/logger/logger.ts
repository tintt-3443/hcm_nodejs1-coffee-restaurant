import path from 'path';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
    }),
  ],
});
