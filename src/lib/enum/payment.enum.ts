export const PaymentStatusEnum = {
  PAYMENT_WAITING: 'PAYMENT_WAITING',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_PAID: 'PAYMENT_PAID',
  PAYMENT_PARTIALLY_PAID: 'PAYMENT_PARTIALLY_PAID',
  PAYMENT_WAITING_REFUND: 'PAYMENT_WAITING_REFUND',
  PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
  PAYMENT_SETTLE: 'PAYMENT_SETTLE',
} as const;
export type PaymentStatusEnum = (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum];

export const PaymentLinkStatusEnum = {
  WAITING: 'WAITING',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PAID: 'PAID',
} as const;
export type PaymentLinkStatusEnum =
  (typeof PaymentLinkStatusEnum)[keyof typeof PaymentLinkStatusEnum];
