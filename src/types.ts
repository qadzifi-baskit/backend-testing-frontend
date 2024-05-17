export type PricetTier = {
  id: string;
  margin: number;
  max: number;
  min: number;
  sellingPrice: number;
  tierNo: number;
};

export type Product = {
  name: string;
  id: string; // Inventory ID
  productId: string;
  companyId: string;
  priceTiers: PricetTier[],
  stock: number;
  sellingPrice: number;
  status: string;
};

export type PaymentType = {
  id: string;
  name: string;
};

export type Cart = {
  id: string; // Cart ID
  inventoryId: string;
  productId: string;
  companyId: string;
  sellingPrice: number;
  fullName: string;
  qty: number;
};
