<script lang="ts">
  import { DeliveryTypeEnum, OrderStatusEnum } from '@/lib/enum';
  import type { AxiosInstance } from 'axios';
  import DatePicker from '../DatePicker.svelte';
  import Select from '../Select.svelte';
  import type { OrderReason } from '@/types';
  import { listenDoAuth } from '@/event';

  export let onUpdateStatus:undefined|((status?: string) => void) = undefined;
  export let id:string;
  export let client:AxiosInstance;
  let selectedDate = new Date();
  let selectedReasonId = '';
  let cancelReasonList:OrderReason[] = [];

  const excludedStatus:OrderStatusEnum[] = [
    OrderStatusEnum.ORDER_PARTIAL_RECEIVED,
  ];
  let orderStatus: OrderStatusEnum = OrderStatusEnum.WAITING_FOR_PICK_UP;

  const getCancelReason = async () => {
    const response = await client.get('/order/reason?type=CANCEL');
    if (response.status === 200) {
      cancelReasonList = response.data?.data ?? [];
      selectedReasonId = cancelReasonList?.[0]?.id;
    }
  };

  listenDoAuth(() => {
    getCancelReason();
  });

  const updateStatus = async () => {
    switch (orderStatus) {
      case OrderStatusEnum.WAITING_FOR_PICK_UP:
        await client.patch(`/order/status/${id}`, {
          orderStatus,
          deliveryType: DeliveryTypeEnum.SELLER_DELIVERY,
          estimatePickupDate: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + 1,
          ),
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
      case OrderStatusEnum.ORDER_CANCELLED:
        await client.patch(`/order/status/${id}`, {
          orderStatus,
          reasonId: selectedReasonId,
          reasonDescription: 'Barang tidak tersedia',
        });
        break;
      default:
        throw new Error('Update not handled');
    }
    onUpdateStatus?.(orderStatus);
  };
  const onSelectDate = (event: CustomEvent<Date>) => {
    selectedDate = event.detail;
  };
</script>

<Select
  title='Status'
  showvalue
  options={Object.entries(OrderStatusEnum)
    .filter(([, status]) => !excludedStatus.includes(status))
  }
  bind:value={orderStatus}
/>
<DatePicker
  on:select-date={onSelectDate}
/>
<div class="inline">
  <Select
    title="Reason"
    showvalue
    options={cancelReasonList.map((val) => [val.id, val.name])}
    bind:value={selectedReasonId}
  />
</div>
<button
  class="btn bg-slate-600"
  on:click={updateStatus}>
  Update
</button>
