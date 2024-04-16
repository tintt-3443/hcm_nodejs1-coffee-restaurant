import { IsNotEmpty } from 'class-validator';

export class ParamsAddCartDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  size: boolean;

  @IsNotEmpty()
  toppings: number[];
}

export class ParamsUpdateCartDto {
  @IsNotEmpty()
  productInstanceId: number;

  @IsNotEmpty()
  quantity: number;
}
