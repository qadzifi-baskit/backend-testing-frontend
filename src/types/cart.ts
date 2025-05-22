import type { DeliveryTypeEnum } from '@/lib/enum';
import type { MemberDiscountLevel } from '@/lib/enum/memberDiscount.enum';

export type Cart = {
  id: string, // Cart ID
  inventoryId: string,
  productId: string,
  companyId: string,
  initialPrice: number,
  startPrice: number|null,
  discount: number|null,
  discountAmount: number|null,
  taxType: string|null,
  tax: number|null,
  tierPrice: number,
  sellingPrice: number,
  fullName: string,
  name: string,
  qty: number,
  warehouse: number,
  memberLevel: MemberDiscountLevel|null,
  memberDiscountAmount: number|null,
};

export type CartDraftUserAddress = {
  provinceId?: number|null,
  regencyId?: number|null,
  address?: string|null,
  postalCode?: string|null,
};

export type CartDraftUser = {
  companyName?: string|null,
  picName?: string|null,
  phone?: string|null,
  email?: string|null,
  billingAddress?: CartDraftUserAddress|null,
  deliveryAddress?: CartDraftUserAddress|null,
};

export type CartCustomerData = {
  companyName: string|null,
};

export type CartParent = {
  createdAt: string,
  id: string,
  creationDate: Date|null,
  customerId: string|null,
  customer: CartCustomerData|null,
  estimatedPickupDate: string|null,
  orderCode: string|null,
  refCode: string|null,
  address: string|null,
  provinceId: number|null,
  regencyId: number|null,
  districtId: number|null,
  postalCode: string|null,
  salesId: string|null,
  deliveryType: DeliveryTypeEnum|null,
  paymentTypeId: string|null,
  shippingCost: number|null,
  tax: number|null,
  notes: string|null,
  customerData: CartDraftUser|null,
  companyId?: string,
  salesName: string|null,
  total?: string|null,
};
