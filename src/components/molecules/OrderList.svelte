<script lang="ts">
  import type { Order } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList, FaSolidPencil } from 'svelte-icons-pack/fa';
  import Collapse from '../Collapse.svelte';
  import Modal from '../Modal.svelte';
  import Table from '../Table.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import OrderDetail from './OrderDetail.svelte';
  import UpdateStatus from './UpdateStatus.svelte';

  export let endpoint = 'list-order';
  export let client:AxiosInstance;
  export let userId:string|undefined = undefined;
  export let orderType = 'SHOP';

  let orderList:Order[] = [];
  let page = '1';

  const onGetOrderList = async () => {
    const query:Record<string, string> = {
      $order: 'createdAt',
      $sort: 'DESC',
      $limit: '10',
      $page: page,
      orderType,
    };
    if (userId) {
      query.userId = userId;
    }
    const params = new URLSearchParams(query);
    const response = await client.get(`/order/${endpoint}?${params.toString()}`);
    if (response.status === 200) {
      orderList = response.data.data;
    }
  };
  $: {
    page;
    onGetOrderList();
  }
  let selectedId = '';
  let statusDialog:HTMLDialogElement;
  let detailDialog:HTMLDialogElement;
  const updateStatus = (id: string) => () => {
    if (selectedId === id) {
      return closeDialog();
    }
    selectedId = id;
    statusDialog?.showModal();
    return;
  };
  const showDetail = (id: string) => () => {
    if (selectedId === id) {
      return closeDialog();
    }
    selectedId = id;
    detailDialog?.showModal();
  };
  const onCloseModal = () => {
    selectedId = '';
  };
  const closeDialog = () => {
    statusDialog?.close();
    detailDialog?.close();
  };
  const onUpdateStatus = () => {
    closeDialog();
    onGetOrderList();
  };
</script>

<Modal
  bind:dialog={statusDialog}
  onClose={onCloseModal}
>
  <UpdateStatus
    bind:id={selectedId}
    {client}
    {onUpdateStatus}
  />
</Modal>
<Modal
  bind:dialog={detailDialog}
  onClose={onCloseModal}
>
  <OrderDetail
    bind:id={selectedId}
    {client}
  />
</Modal>
<Collapse title='Order' onClick={onGetOrderList}>
  <button class="btn" on:click={onGetOrderList}>Get Order</button>
  <select class="select w-full max-w-xs" bind:value={page}>
    <option selected value="1">1</option>
    {#each Array.from({ length: 99 }, (_, i) => i + 2) as num}
      <option value={num}>{num}</option>
    {/each}
  </select>
  {#if orderList.length > 0}
    <Table itemList={orderList}>
      <svelte:fragment slot="header">
        <th>Id</th>
        <th>Date</th>
        <th>Order Code</th>
        <th></th>
        <th></th>
        <th>Status</th>
        <th>Payment</th>
        <th>Payment Status</th>
        <th>Payment Link Status</th>
        <th>Total</th>
      </svelte:fragment>
      <svelte:fragment slot="item" let:item={order}>
        <td><NoWrap>{order.id}</NoWrap></td>
        <td><NoWrap>{order.createdAt}</NoWrap></td>
        <td>{order.orderCode}</td>
        <td>
          <button
            on:click={updateStatus(order.id)}
            class="btn bg-slate-600"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td>
          <button
            on:click={showDetail(order.id)}
            class="btn bg-slate-600"
          >
            <Icon src={FaSolidList}/>
          </button>
        </td>
        <td>{order.deliveryType}</td>
        <td>{order.status}</td>
        <td><NoWrap>{order.paymentTerm}</NoWrap></td>
        <td><NoWrap>{order.paymentStatus}</NoWrap></td>
        <td><NoWrap>{order.paymentLinkStatus}</NoWrap></td>
        <td>{order.grandTotal}</td>
      </svelte:fragment>
    </Table>
  {/if}
</Collapse>

