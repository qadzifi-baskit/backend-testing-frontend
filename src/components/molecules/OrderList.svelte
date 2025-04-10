<script lang="ts">
  import type { AuthStore, Order } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList, FaSolidPencil } from 'svelte-icons-pack/fa';
  import Collapse from '../Collapse.svelte';
  import Modal from '../Modal.svelte';
  import Table from '../Table.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import OrderDetail from './OrderDetail.svelte';
  import UpdateStatus from './UpdateStatus.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import type { Writable } from 'svelte/store';

  type Props = {
    endpoint?: string,
    client: AxiosInstance,
    userId?: string,
    orderType?: string|string[],
    companyId?: string,
    store?: Writable<AuthStore>,
    show?: boolean,
  };

  let {
    endpoint = 'list-order',
    client,
    userId = undefined,
    orderType = 'SHOP',
    companyId,
    store,
    show = $bindable(false),
  }:Props = $props();

  let orderList:Order[] = $state([]);
  let page = $state(1);

  const getOrderList = async () => {
    if ($store && !$store.loggedIn) return;
    const params = new URLSearchParams({
      $order: 'createdAt',
      $sort: 'DESC',
      $limit: '10',
      $page: `${page}`,
    });
    if (Array.isArray(orderType)) {
      orderType.forEach((type) => params.append('orderType', type));
    } else if (orderType) {
      params.append('orderType', orderType);
    }
    if (userId) {
      params.append('userId', userId);
    }
    if (companyId) {
      params.append('companyId', companyId);
    }
    const response = await client.get(
      `/order/${endpoint}`,
      { params },
    );
    if (response.status === 200) {
      orderList = response.data.data;
    }
  };

  $effect(() => {
    if (show) {
      page;
      getOrderList();
    }
  });

  let selectedId = $state('');
  let statusDialog:HTMLDialogElement|undefined = $state();
  let detailDialog:HTMLDialogElement|undefined = $state();
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
    getOrderList();
  };
</script>

<Modal
  bind:dialog={statusDialog}
  onclose={onCloseModal}
>
  <UpdateStatus
    bind:id={selectedId}
    {client}
    {onUpdateStatus}
  />
</Modal>
<Modal
  bind:dialog={detailDialog}
  onclose={onCloseModal}
>
  <OrderDetail
    bind:id={selectedId}
    {client}
  />
</Modal>
<Collapse title='Order' onclick={getOrderList}>
  <PaginationNavigationPanel
    bind:page
    onreload={getOrderList}
  />
  <button class="btn" onclick={getOrderList}>Get Order</button>
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
            onclick={updateStatus(order.id)}
            class="btn btn-secondary"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td>
          <button
            onclick={showDetail(order.id)}
            class="btn btn-secondary"
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

