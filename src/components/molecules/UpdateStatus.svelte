<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Select from '../Select.svelte';
  import { DeliveryTypeEnum, OrderStatusEnum } from '@/lib/enum';

  export let onUpdateStatus:undefined|((status?: string) => void) = undefined;
  export let id:string;
  export let client:AxiosInstance;

  const excludedStatus:OrderStatusEnum[] = [
    OrderStatusEnum.ORDER_PARTIAL_RECEIVED,
  ];
  let orderStatus: OrderStatusEnum = OrderStatusEnum.WAITING_FOR_PICK_UP;

  const updateStatus = async () => {
    const now = new Date();
    switch (orderStatus) {
      case OrderStatusEnum.WAITING_FOR_PICK_UP:
        await client.patch(`/order/status/${id}`, {
          orderStatus,
          deliveryType: DeliveryTypeEnum.SELLER_DELIVERY,
          estimatePickupDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        });
        break;
      case OrderStatusEnum.ORDER_PICKED_UP:
        await client.patch(`/order/status/${id}`, {
          orderStatus,
        });
        break;
      case OrderStatusEnum.ORDER_RECEIVED:
        await client.patch(`/order/status/${id}`, {
          orderStatus,
        });
        break;
      default:
        throw new Error('Update not handled');
    }
    onUpdateStatus?.(orderStatus);
  };
</script>

<Select
  title='Status'
  showValue
  options={Object.entries(OrderStatusEnum)
    .filter(([, status]) => !excludedStatus.includes(status))
  }
  bind:value={orderStatus}
/>
<button
  class="btn bg-slate-600"
  on:click={updateStatus}>
  Update
</button>
