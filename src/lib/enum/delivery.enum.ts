export const DeliveryTypeEnum = {
  BASKIT_DELIVERY: 'BASKIT_DELIVERY',
  SELLER_DELIVERY: 'SELLER_DELIVERY',
  PICK_UP: 'PICK_UP',
  DROPSHIP_DELIVERY: 'DROPSHIP_DELIVERY',
  WAREHOUSE_DELIVERY: 'WAREHOUSE_DELIVERY',
} as const;
export type DeliveryTypeEnum = (typeof DeliveryTypeEnum)[keyof typeof DeliveryTypeEnum];
