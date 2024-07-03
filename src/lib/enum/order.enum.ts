export const OrderStatusEnum = {
  ORDER_CREATED: 'ORDER_CREATED',
  WAITING_FOR_PICK_UP: 'WAITING_FOR_PICK_UP',
  ORDER_PICKED_UP: 'ORDER_PICKED_UP',
  ORDER_RECEIVED: 'ORDER_RECEIVED',
  ORDER_PARTIAL_RECEIVED: 'ORDER_PARTIAL_RECEIVED',
  ORDER_FINISHED: 'ORDER_FINISHED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_PENDING: 'ORDER_PENDING',
} as const;
export type OrderStatusEnum =
  (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];

export const DeliveryTypeEnum = {
  BASKIT_DELIVERY: 'BASKIT_DELIVERY',
  SELLER_DELIVERY: 'SELLER_DELIVERY',
} as const;
export type DeliveryTypeEnum =
  (typeof DeliveryTypeEnum)[keyof typeof DeliveryTypeEnum];

export const OrderDetailStatusEnum = {
  CHANGE_QTY: 'CHANGE_QTY',
  CHANGE_PRICE: 'CHANGE_PRICE',
  CHANGE_QTY_PRICE: 'CHANGE_QTY_PRICE',
  CANCELLED: 'CANCELLED',
  FINISHED: 'FINISHED',
  FINISHED_CHANGE_QTY: 'FINISHED_CHANGE_QTY',
  FINISHED_CHANGE_PRICE: 'FINISHED_CHANGE_PRICE',
  FINISHED_CHANGE_QTY_PRICE: 'FINISHED_CHANGE_QTY_PRICE',
  DETAIL_UPDATED: 'DETAIL_UPDATED',
} as const;
export type OrderDetailStatusEnum =
  (typeof OrderDetailStatusEnum)[keyof typeof OrderDetailStatusEnum];

