import { IsNotEmpty } from 'class-validator';
import { PAYMENT_METHOD } from '../../constant/enum';

export class PaymentDto {
  @IsNotEmpty()
  user_id: number;
  @IsNotEmpty()

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  isOnline: boolean;

  note: string;

  @IsNotEmpty()
  payment_method: PAYMENT_METHOD;
}
