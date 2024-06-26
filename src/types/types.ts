export type PriceTier = {
  id: string;
  margin: number;
  max: number;
  min: number;
  sellingPrice: number;
  tierNo: number;
};

export type PaymentType = {
  id: string;
  name: string;
};

export type WarehouseDetail = {
  id: string;
  name: number;
};

export type Warehouse = {
  id: string;
  name: string;
  wareHouse: WarehouseDetail;
};

export type Product = {
  name: string;
  id: string; // Inventory ID
  productId: string;
  companyId: string;
  priceTiers: PriceTier[],
  stock: number;
  sellingPrice: number;
  status: string;
  warehouse: number;
};

export type Cart = {
  id: string; // Cart ID
  inventoryId: string;
  productId: string;
  companyId: string;
  sellingPrice: number;
  fullName: string;
  name: string;
  qty: number;
  warehouse: number;
};
