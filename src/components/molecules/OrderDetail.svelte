<script lang="ts">
  import type { OrderDetail, OrderReason } from '@/types';
  import { type AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidTrash } from 'svelte-icons-pack/fa';
  import { writable } from 'svelte/store';
  import Table from '../Table.svelte';
  export let id:string;
  export let client:AxiosInstance;

  const detailList = writable(<OrderDetail[]>[]);
  const reasonList = writable(<OrderReason[]>[]);

  const getDetail = async (detailId: string) => {
    const detailResponse = await client.get(`/order/${detailId}`);
    if (detailResponse.status === 200) {
      detailList.set(detailResponse?.data?.data?.orderDetail ?? []);
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
    <td>{item.qty}</td>
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
