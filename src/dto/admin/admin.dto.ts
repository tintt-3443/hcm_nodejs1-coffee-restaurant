import { IsNumber, IsOptional, IsString } from 'class-validator';
import { STATUS_ORDER } from '../../constant/enum';

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
