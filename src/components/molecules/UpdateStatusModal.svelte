<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { DeliveryTypeEnum, OrderStatusEnum } from '@/lib/enum';
  import type { OrderReason } from '@/types';
  import DatePicker from '../DatePicker.svelte';
  import Modal from '../Modal.svelte';
  import Select from '../Select.svelte';
  import { Context } from '@/lib/helper/context';
  import type { EventHandler } from 'svelte/elements';

  type Props = {
    onUpdateStatus?: (status: OrderStatusEnum) => void;
    id: string;
    dialog?: HTMLDialogElement;
    onclose?: EventHandler<Event, HTMLDialogElement>;
  };
  let {
    onUpdateStatus = $bindable(),
    id = $bindable(''),
    dialog = $bindable(),
    onclose,
  }: Props = $props();

  const { client } = Context.strict;

  let selectedDate = new Date();
  let selectedReasonId = $state('');
  let cancelReasonList:OrderReason[] = $state([]);

  const excludedStatus:OrderStatusEnum[] = [
    OrderStatusEnum.ORDER_PARTIAL_RECEIVED,
  ];
  let orderStatus: OrderStatusEnum = $state(OrderStatusEnum.WAITING_FOR_PICK_UP);

  async function getCancelReason() {
    const response = await client.get('/order/reason?type=CANCEL');
    if (response.status === 200) {
      cancelReasonList = response.data?.data ?? [];
      selectedReasonId = cancelReasonList?.[0]?.id;
    }
  };

  listenAuthSuccess(() => {
    if (dialog?.open) {
      getCancelReason();
    }
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
      case OrderStatusEnum.ORDER_CREATED:
      case OrderStatusEnum.ORDER_PICKED_UP:
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

<Modal
  bind:dialog
  onopen={getCancelReason}
  {onclose}
>
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
    class="btn btn-secondary"
    onclick={updateStatus}>
    Update
  </button>
</Modal>
