import type { PriceTier } from './inventory';

export type Product = {
  name: string,
  id: string, // Inventory ID
  productId: string,
  companyId: string,
  priceTiers: PriceTier[],
  stock: number,
  sellingPrice: number,
  status: string,
  warehouse: number,
};
