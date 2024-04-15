import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
dotenv.config();

const port: number = process.env.PORTDB ? parseInt(process.env.PORTDB) : 3306;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.HOST || 'localhost',
  port: port,
  username: process.env.USERNAMEDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});
initializeTransactionalContext({
  storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
});
addTransactionalDataSource(AppDataSource);
