export interface IGetAllParams {
  page: number;
  limit: number;
}

export interface ParamsAddCart {
  userId: number;
  productId: number;
  quantity: number;
  size: boolean;
  toppings: number[];
}
