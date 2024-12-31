import type { MemberDiscountLevel } from '@/lib/enum/memberDiscount.enum';

export type PriceTier = {
  id: string,
  margin: number,
  max: number,
  min: number,
  sellingPrice: number,
  tierNo: number,
};

export type MemberDiscount = {
  level: MemberDiscountLevel,
  inventoryId: string,
  amount: number,
};

export type Inventory = {
  id: string,
  stock: number,
  fullName: string,
  productId: string,
  companyId: string,
  isActive: boolean,
  basePrice: number,
  sellingPrice: number,
  customerPrice: number,
  priceTier: PriceTier[],
  sellerPriceTier: PriceTier[],
  memberDiscount: MemberDiscount[],
};

export type AddInventoryOptions = {
  moq?: number,
  tierAmount?: number,
};
