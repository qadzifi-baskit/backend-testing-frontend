import type { OrderDetailStatusEnum } from '@/lib/enum';
import type { Cart } from './cart';

export type AuthStore = {
  userId: string,
  loggedIn: boolean,
};

export type PaymentType = {
  id: string,
  name: string,
};

export type CompanyDetail = {
  id: string,
  address: string,
  personInCharge: string,
};

export type CompanyStatus = 'APPROVED'|'INACTIVE';

export type Company = {
  id: string,
  companyName: string,
  status: CompanyStatus,
  detail: CompanyDetail,
};

export type CompanyType = {
  id: string,
  name: string,
  type: string,
  parentId: string|null,
};

export type WarehouseDetail = {
  id: string,
  name: number,
};

export type Warehouse = {
  id: string,
  name: string,
  wareHouse: WarehouseDetail,
};

export type ContentEntity = {
  id: string,
  code: string,
  name: string,
};

export type Brand = ContentEntity;

export type Principal = ContentEntity;

export type ProductMaster = {
  id: string,
  sku: string,
  name: string,
  fullName: string,
  image: string,
  isAdded: boolean,
};

export type Order = {
  createdAt: string,
  id: string,
  deliveryType: string,
  orderStatus: string,
  status: string,
  orderCode: string,
  paymentTerm: string,
  paymentStatus: string,
  paymentLinkStatus?: string|null,
  total: number,
  grandTotal: number,
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
  role: Role,
};

export type APIACLItem = APIItem & {
  acls: ACLItem[],
};

export type Profile = {
  avatars: string|null,
  firstName: string,
  lastName: string,
  address: string,
  country: string|null,
  position: string|null,
  gstRegistrationNo: string|null,
  zipCode: string|null,
  state: string|null,
  language: string|null,
  currency: string|null,
  timeZone: string|null,
  socialAccount: string|null,
  targetDuration: string|null,
  targetAmount: number,
  idCard: string|null,
  taxPayerIdNumber: string|null,
  document: string|null,
  provinceId: string|null,
  regencyId: string|null,
  districtId: number,
  referralCode: string|null,
};

export type User = {
  id: string,
  email: string,
  phone: string,
  status: string,
  rejectReason: string|null,
  activatedToken: string|null,
  fcmToken: string|null,
  shopLoggedIn: false,
  mongoId: string|null,
  profile: Profile|null,
  roles: Role[],
  countBuyerAssigned: number,
  leader: string|null,
  lastAccess: string|null,
  createdAt: string
};
