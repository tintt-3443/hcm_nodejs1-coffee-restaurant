import { IsOptional } from 'class-validator';
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
