import type { PaymentType } from './types';

export type OrderContext = {
  paymentTypeList?: PaymentType[],
};

export type UserContext = {
  id?: string,
};
