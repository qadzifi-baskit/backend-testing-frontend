import type { OrderDetailStatusEnum } from '@/lib/enum';

export type AuthStore = {
  loggedIn: boolean,
};

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

export type CompanyType = {
  id: string;
  name: string;
  type: string;
  parentId: string|null;
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

export type ProductMaster = {
  id: string;
  name: string;
  fullName: string;
  image: string;
};

export type UserOffline = {
  id: string;
  status: string;
  firstName: string;
  phone: string;
  email: string;
  customerTypeId: string;
  address: string;
};

export type Inventory = {
  id: string;
  stock: number;
  fullName: string;
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

export type Order = {
  createdAt: string;
  id: string;
  deliveryType: string;
  orderStatus: string;
  status: string;
  orderCode: string;
  paymentTerm: string;
  paymentStatus: string;
  paymentLinkStatus?: string|null;
  total: number;
  grandTotal: number;
  product: Omit<Cart, 'warehouse'>,
};

export type OrderDetail = {
  id: string,
  qty: number,
  sellingPrice: number,
  margin: number,
  marginValue: number,
  fullName: string,
  status: OrderDetailStatusEnum|null,
  reason: string|null,
  notes: string|null,
};

export type UpdateOrderData = {
  id: string,
  qty: number,
  price: number,
  reasonId?: string,
  notes?: string,
};

export type UpdateOrderDetailPayload = {
  qty: number,
  price: number,
};

export type Role = {
  id: string,
  roleName: string,
};

export type OrderReason = {
  id: string,
  name: string,
};

export type APIItem = {
  createdAt: string;
  id: string,
  apiName: string,
  apiGroup: string,
  endpoint: string,
  description: string|null,
};

export type ACLItem = {
  createdAt: string;
  id: string,
  methodPost: boolean,
  methodGet: boolean,
  methodPatch: boolean,
  methodDelete: boolean,
  methodFind: boolean,
  apiId: string,
  roleId: string|null,
  userId: string|null,
  role: Role,
};

export type APIACLItem = APIItem & {
  acls: ACLItem[],
};
