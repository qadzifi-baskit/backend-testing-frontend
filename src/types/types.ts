import type { OrderDetailStatusEnum } from '@/lib/enum';
import type { Cart } from './cart';
import type { Role } from './user';
import type { EntityCategory } from './entityCategory';

export type CompanyStatus = 'APPROVED'|'INACTIVE';

export type AuthStore = {
  userId: string,
  loggedIn: boolean,
};

export type NamedEntity = {
  id: string,
  name: string,
};

export type ContentEntity = NamedEntity & {
  code: string,
};

export type PaymentType = NamedEntity;

export type WarehouseDetail = NamedEntity & { name: number };

export type Warehouse = NamedEntity & {
  wareHouse: WarehouseDetail,
};

export type CompanyType = NamedEntity & {
  type: string,
  parentId: string|null,
};

export type ProductMaster = NamedEntity & {
  sku: string,
  fullName: string,
  image: string,
  isAdded: boolean,
};

export type OrderReason = NamedEntity;

export type Brand = ContentEntity;

export type Principal = ContentEntity;

export type CompanyDetail = {
  id: string,
  address: string,
  personInCharge: string,
};

export type Company = {
  id: string,
  companyName: string,
  status: CompanyStatus,
  detail: CompanyDetail,
};

export type Order = {
  createdAt: string,
  id: string,
  deliveryType: string,
  orderStatus: string,
  status: string,
  orderType: string,
  orderCode: string,
  salesName: string,
  paymentTerm: string,
  paymentStatus: string,
  paymentLinkStatus?: string|null,
  tax: number,
  total: number,
  grandTotal: number,
  product: Omit<Cart, 'warehouse'>,
  linkedOrder: Order[],
};

export type OrderDetail = {
  id: string,
  qty: number,
  neededQty: number,
  orderedQty: number,
  basePrice: number,
  startPrice: number,
  discount: number,
  discountedPrice: number,
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

export type APIItem = {
  createdAt: string,
  id: string,
  apiName: string,
  apiGroup: string,
  endpoint: string,
  description: string|null,
};

export type ACLItem = {
  createdAt: string,
  id: string,
  methodPost: boolean,
  methodGet: boolean,
  methodPatch: boolean,
  methodDelete: boolean,
  methodFind: boolean,
  apiId: string,
  roleId: string|null,
  userId: string|null,
  role?: Role,
  features: EntityCategory[],
};

export type APIACLItem = APIItem & {
  acls: ACLItem[],
};
