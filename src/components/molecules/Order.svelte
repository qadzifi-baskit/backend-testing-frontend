<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import { writable } from 'svelte/store';
  import type { Order } from '@/types';
  import Table from '../Table.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList } from 'svelte-icons-pack/fa';

  export let endpoint = 'history';
  export let client:AxiosInstance;
  export let userId:string|undefined = undefined;

  const orderList = writable(<Order[]>[]);

  const onGetOrderList = async () => {
    const query:Record<string, string> = {
      $order: 'createdAt',
      $sort: 'DESC',
    };
    if (userId) {
      query.userId = userId;
    }
    const params = new URLSearchParams(query);
    const response = await client.get(`/order/${endpoint}?${params.toString()}`);
    if (response.status === 200) {
      orderList.set(response.data.data);
    }
  };
  let selectedOrder = -1;
  let dialog:HTMLDialogElement;
  const toggleOrderDetail = (index: number) => () => {
    if (selectedOrder === index) {
      dialog.close();
      return;
    }
    dialog.showModal();
    return;
  };
  const onCloseModal = () => {
    selectedOrder = -1;
  };
</script>

<dialog bind:this={dialog}
  class="z-50 fixed h-full w-full opacity-75 rounded-xl"
  on:close={onCloseModal}
>
  <Table itemList={$orderList}>
  </Table>
</dialog>
<Collapse title='Order' onclick={onGetOrderList}>
  <button class="btn" on:click={onGetOrderList}>Get Order</button>
  {#if $orderList.length > 0}
    <Table itemList={$orderList}>
      <svelte:fragment slot="header">
        <th>Date</th>
        <th>Order Code</th>
        <th></th>
        <th>Status</th>
        <th>Total</th>
      </svelte:fragment>
      <svelte:fragment slot="item" let:item={order} let:index={index}>
        <td>{order.createdAt}</td>
        <td>{order.orderCode}</td>
        <td>
          <button
            on:click={toggleOrderDetail(index)}
            class="btn btn-secondary"
          >
            <Icon src={FaSolidList}/>
          </button>
        </td>
        <td>{order.orderStatus}</td>
        <td>{order.total}</td>
      </svelte:fragment>
    </Table>
  {/if}
</Collapse>
