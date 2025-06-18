import type { DeliveryTypeEnum, OrderStatusEnum, OrderTypeEnum } from '@/lib/enum';
import type { PaymentLinkStatusEnum, PaymentStatusEnum } from '@/lib/enum/payment.enum';

export type Order = {
  id: string;
  userId: string | null;
  orderType: OrderTypeEnum;
  orderCode: string;
  refCode: string | null;
  paymentTypeId: string;
  paymentNotes: string | null;
  paymentLink: string | null;
  paymentLinkId: string | null;
  paymentLinkStatus: PaymentLinkStatusEnum | null;
  paymentLinkExpiredDate: Date | null;
  status: OrderStatusEnum;
  totalQty: number;
  subTotal: number;
  totalBasePrice: number;
  serviceFeeB: number;
  total: number;
  shippingCost: number | null;
  taxType: string | null;
  tax: number | null;
  companyId: string | null;
  wareHouse: number | null;
  paymentStatus: PaymentStatusEnum;
  deliveryType: DeliveryTypeEnum | null;
  estimatePickupDate: Date | null;
  reasonDescription: string | null;
  reasonId: string | null;
  userOfflineId: string | null;
  paidAmount: number;
  salesmanId: string | null;
  podImages: string[];
  notes: string | null;
  expeditionName: string | null;
};

export type CreateOrderPayload = Partial<Order> & {
  linkedOrderId?: string | null;
};
