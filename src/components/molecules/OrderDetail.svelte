<script lang="ts">
  import type { AuthStore, OrderDetail, OrderReason, UpdateOrderData, UpdateOrderDetailPayload } from '@/types';
  import type { HistoryEntity } from '@/types/history';
  import { type AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidTrash } from 'svelte-icons-pack/fa';
  import Table from '../Table.svelte';
  import type { Writable } from 'svelte/store';

  type Props = {
    client: AxiosInstance,
    id: string,
    store?: Writable<AuthStore>,
    onUpdateOrder?:((data: UpdateOrderData[]) => unknown),
  };
  let {
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
    const detailResponse = await client.get(`/order/${detailId}`);
    if (detailResponse.status === 200) {
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
</script>

<Table itemList={detailList}>
  <svelte:fragment slot="header">
    <th>Name</th>
    <th>Qty</th>
    <th>Status</th>
    <th></th>
  </svelte:fragment>
  <svelte:fragment slot="item" let:item>
    <td>{item.fullName}</td>
    <td>
      <input type="number" placeholder="qty" bind:value={updateDataMap[item.id].qty} class="input input-bordered w-24 max-w-xs"
        onchange={(e) => { updateDataMap[item.id].qty = Number(e.currentTarget.value) }}
      />
    </td>
    <td>{item.status}</td>
    <td>
      <button
        onclick={onCancel(item.id)}
        class="btn"
      >
        <Icon
          src={FaSolidTrash}
        />
      </button>
    </td>
  </svelte:fragment>
</Table>
<Table itemList={historyList}>
</Table>
<button class="btn bg-slate-600"
  onclick={processUpdate}
>
  Update
</button>
