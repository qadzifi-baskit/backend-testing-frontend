<script lang="ts">
  import type { AuthStore, OrderDetail, OrderReason, UpdateOrderData, UpdateOrderDetailPayload } from '@/types';
  import type { HistoryEntity } from '@/types/history';
  import { type AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidTrash } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import Table from '../Table.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import TutorialManagement from './TutorialManagement.svelte';
  import Modal from '../Modal.svelte';
  import type { EventHandler } from 'svelte/elements';
  import { OrderTypeEnum } from '@/lib/enum';
  import { SellerSalesOrderTypeMap } from '@/consts/order';

  type Props = {
    dialog?: HTMLDialogElement,
    onclose?: EventHandler<Event, HTMLDialogElement>,
    client: AxiosInstance,
    id: string,
    store?: Writable<AuthStore>,
    onUpdateOrder?:((data: UpdateOrderData[]) => unknown),
  };
  let {
    dialog = $bindable(),
    onclose,
    client,
    id = $bindable(''),
    store,
    onUpdateOrder = async (data) => {
      await client.patch(`/order/detail/bulk/${id}`, data);
      getDetail(id);
    },
  }:Props = $props();

  const updateDataMap:Record<string, UpdateOrderDetailPayload> = {};

  let detailList:OrderDetail[] = $state([]);
  let reasonList:OrderReason[] = $state([]);
  let historyList:HistoryEntity[] = $state([]);
  let orderType = $state<OrderTypeEnum>(OrderTypeEnum.OFFLINE);
  let showNotif = $state(false);

  const getHistory = async (orderId: string) => {
    if ($store && !$store.loggedIn) return;
    const params = new URLSearchParams({
      $order: 'createdAt',
      $sort: 'DESC',
      refId: orderId,
    });
    const response = await client.get(
      '/history',
      { params },
    );
    if (response.status !== 200) {
      return;
    }

    historyList = response.data?.data ?? [];
  };

  const getDetail = async (detailId: string) => {
    if ($store && !$store.loggedIn) return;
    orderType = OrderTypeEnum.OFFLINE; // Default to OFFLINE;
    const detailResponse = await client.get(`/order/${detailId}`);
    if (detailResponse.status === 200) {
      orderType = detailResponse.data?.data?.orderType ?? OrderTypeEnum.OFFLINE;
      const newDetailList:OrderDetail[] = detailResponse?.data?.data?.orderDetail ?? [];
      for (const { id, qty, sellingPrice: price } of newDetailList) {
        updateDataMap[id] = {
          qty,
          price,
        };
      }
      detailList = newDetailList;
    }
    const reasonResponse = await client.get('/order/reason?type=SKU');
    if (reasonResponse.status === 200) {
      reasonList = reasonResponse?.data?.data ?? [];
    }
  };

  $effect(() => {
    if (id) {
      getDetail(id);
      getHistory(id);
    }
  });

  const onCancel = (detailId: string) => async () => {
    if ($store && !$store.loggedIn) return;
    await client.patch(`/order/detail/bulk/${id}`, [
      {
        id: detailId,
        qty: 0,
        reasonId: reasonList[0].id,
        notes: '',
      },
    ]);
    getDetail(id);
  };

  const processUpdate = () => {
    if ($store && !$store.loggedIn) return;
    const updateData:UpdateOrderData[] = Object.entries(updateDataMap).map(([detailId, detail]) => (
      {
        id: detailId,
        qty: detail.qty,
        price: detail.price,
        reasonId: reasonList?.[0]?.id,
        notes: '',
      }
    ));
    onUpdateOrder(updateData);
  };

  let notifSection:ReturnType<typeof TutorialManagement>;

  $effect(() => {
    if (id) {
      notifSection?.reloadData();
    }
  });
</script>

<Modal
  bind:title={id}
  bind:dialog
  {onclose}
  onopen={() => {
    showNotif = true;
  }}
>
  <div>
    <PaginationNavigationPanel search={undefined} page={undefined} onreload={() => getDetail(id)}/>
  </div>
  <Table5 itemList={detailList}>
    {#snippet header()}
      <td>Name</td>
      <td>Qty</td>
      {#if SellerSalesOrderTypeMap[orderType]}
        <td>Needed Qty</td>
        <td>Ordered Qty</td>
      {/if}
      <td>Base Price</td>
      <td>Start Price</td>
      <td>Discount Amount</td>
      <td>Discounted Price</td>
      <td>Selling Price</td>
      <td>Status</td>
      <td></td>
    {/snippet}
    {#snippet content(item)}
      <td>{item.fullName}</td>
      <td>
        <input type="number" placeholder="qty" bind:value={updateDataMap[item.id].qty} class="input input-bordered w-24 max-w-xs"
          onchange={(e) => { updateDataMap[item.id].qty = Number(e.currentTarget.value) }}
        />
      </td>
      {#if SellerSalesOrderTypeMap[orderType]}
        <td>{item.neededQty}</td>
        <td>{item.orderedQty}</td>
      {/if}
      <td>{item.basePrice}</td>
      <td>{item.startPrice}</td>
      <td>{item.discount}</td>
      <td>{item.discountedPrice}</td>
      <td>{item.sellingPrice}</td>
      <td>{item.status}</td>
      <th>
        <button
          onclick={onCancel(item.id)}
          class="btn"
        >
          <Icon
            src={FaSolidTrash}
          />
        </button>
      </th>
    {/snippet}
  </Table5>
  <button class="btn btn-secondary"
    onclick={processUpdate}
  >
    Update
  </button>
  <TutorialManagement bind:this={notifSection} bind:show={showNotif} bind:ownerId={id}/>
  <Table itemList={historyList}/>
</Modal>
