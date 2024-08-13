<script lang="ts">
  import type { OrderDetail, OrderReason, UpdateOrderData, UpdateOrderDetailPayload } from '@/types';
  import { type AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidTrash } from 'svelte-icons-pack/fa';
  import { writable } from 'svelte/store';
  import Table from '../Table.svelte';
  export let id:string;
  export let client:AxiosInstance;

  const detailList = writable(<OrderDetail[]>[]);
  const reasonList = writable(<OrderReason[]>[]);
  const updateDataMap:Record<string, UpdateOrderDetailPayload> = {};

  const getDetail = async (detailId: string) => {
    const detailResponse = await client.get(`/order/${detailId}`);
    if (detailResponse.status === 200) {
      const newDetailList:OrderDetail[] = detailResponse?.data?.data?.orderDetail ?? [];
      for (const { id, qty, sellingPrice: price } of newDetailList) {
        updateDataMap[id] = {
          qty,
          price,
        };
      }
      detailList.set(newDetailList);
    }
    const reasonResponse = await client.get('/order/reason?type=SKU');
    if (reasonResponse.status === 200) {
      reasonList.set(reasonResponse?.data?.data ?? []);
    }
  };

  $: if (id) {
    getDetail(id);
  }

  const onCancel = (detailId: string) => async () => {
    await client.patch(`/order/detail/bulk/${id}`, [
      {
        id: detailId,
        qty: 0,
        reasonId: $reasonList[0].id,
        notes: '',
      },
    ]);
    getDetail(id);
  };

  export let onUpdateOrder:((data: UpdateOrderData[]) => unknown) = async (data) => {
    await client.patch(`/order/detail/bulk/${id}`, data);
    getDetail(id);
  };

  const processUpdate = () => {
    const updateData:UpdateOrderData[] = Object.entries(updateDataMap).map(([detailId, detail]) => (
      {
        id: detailId,
        qty: detail.qty,
        price: detail.price,
        reasonId: $reasonList?.[0]?.id,
        notes: '',
      }
    ));
    onUpdateOrder(updateData);
  };
</script>

<Table itemList={$detailList}>
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
        on:change={(e) => { updateDataMap[item.id].qty = Number(e.currentTarget.value) }}
      />
    </td>
    <td>{item.status}</td>
    <td>
      <button
        on:click={onCancel(item.id)}
        class="btn"
      >
        <Icon
          src={FaSolidTrash}
        />
      </button>
    </td>
  </svelte:fragment>
</Table>
<button class="btn bg-slate-600"
  on:click={processUpdate}
>
  Update
</button>
