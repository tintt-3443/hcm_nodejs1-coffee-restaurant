export interface IGetAllParams {
  page: number;
  limit: number;
  keyword?: string;
  minRange?: number;
  maxRange?: number;
  typeId?: number;
}

export interface IUpdateProfile {
  userId: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  date_of_birth: string;
  avatar: string;
}

export interface IResultCloudinary {
  url?: string;
}

export interface ICreateRating {
  userId: number;
  productId: number;
  rating_point: number;
  comment: string;
}
