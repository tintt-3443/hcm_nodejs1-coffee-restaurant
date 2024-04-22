export enum ROLE_USER {
  ADMIN = 'admin',
  USER = 'user',
}

export enum SEX_USER {
  MALE = 'male',
  FEMALE = 'female',
}

export enum SIZE_PRODUCT {
  M = 'M',
  L = 'L',
}

export enum PAYMENT_METHOD {
  COD = 'cod',
  BANKING = 'banking',
}

export enum STATUS_ORDER {
  PENDING = 'pending',
  SHIPPING = 'shipping',
  SUCCESS = 'success',
  REJECT = 'reject', // admin cancel
  CANCEL = 'cancel', // user cancel
}

export const enum TYPE_PRODUCT {
  DRINK = 1,
  CAKE = 2,
}
