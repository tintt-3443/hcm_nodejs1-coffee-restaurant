import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { STATUS_ORDER } from '../../constant/enum';
import { CONSTANT } from '../../constant/variable';

export class InvoiceAdminDto {
  @IsOptional()
  date: Date;
  startDate: Date | undefined;
  endDate: Date | undefined;
  status?: STATUS_ORDER[] | undefined;
  sortASC?: boolean | undefined;
  minRange?: number | undefined;
  maxRange?: number | undefined;
  page?: number;
  limit?: number;
}

export class ProductAdminDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsString()
  name?: string;

  @IsString()
  description?: string;

  price?: number;

  @IsOptional()
  image?: string;
  @IsOptional()
  file?: string | undefined;
}

export class BlogDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  content: string;
}
export class StatisticDashboardDto {
  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  type?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  specifyDate?: Date;
}
