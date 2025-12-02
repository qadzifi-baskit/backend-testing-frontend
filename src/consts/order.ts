import { OrderTypeEnum } from '@/lib/enum';
import { DefaultMap } from '@/lib/helper/model';

export const OverStockOrderTypeList:(OrderTypeEnum|undefined)[] = [
  OrderTypeEnum.SELLER_SALES_ORDER,
  OrderTypeEnum.SELLER_PURCHASE_ORDER,
  OrderTypeEnum.BSC_SELLER_SALES_ORDER,
  OrderTypeEnum.BSC_SELLER_PURCHASE_ORDER,
];

export const SellerSalesOrderTypeMap = DefaultMap<OrderTypeEnum,boolean>(() => false, {
  [OrderTypeEnum.SELLER_SALES_ORDER]: true,
  [OrderTypeEnum.BSC_SELLER_SALES_ORDER]: true,
});

export const BSCOrderType: OrderTypeEnum[] = [
  OrderTypeEnum.BSC_SELLER_SALES_ORDER,
  OrderTypeEnum.BSC_SELLER_PURCHASE_ORDER,
];
