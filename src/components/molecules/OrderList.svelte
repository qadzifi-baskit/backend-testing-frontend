<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import type { Order } from '@/types';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList, FaSolidPencil } from 'svelte-icons-pack/fa';
  import Collapse from '../Collapse.svelte';
  import DatePicker from '../DatePicker.svelte';
  import Modal from '../Modal.svelte';
  import Table5 from '../Table5.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import OrderDetail from './OrderDetail.svelte';
  import UpdateStatus from './UpdateStatus.svelte';

  type Props = {
    endpoint?: string,
    userId?: string,
    orderType?: string|string[],
    companyId?: string,
    show?: boolean,
  };

  let {
    endpoint = 'list-order',
    userId = undefined,
    orderType = 'SHOP',
    companyId,
    show = $bindable(false),
  }:Props = $props();

  const store = Context.auth;
  const { client } = Context.strict;

  let orderList:Order[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let endDate:Date|null = $state(null);
  let linkedOrderId = $state('');

  async function getOrderList() {
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
    if (endDate) {
      params.append('end', endDate.toISOString());
    }
    if (linkedOrderId) {
      params.append('linkedOrderId', linkedOrderId);
    }
    const response = await client.get(
      `/order/${endpoint}`,
      { params },
    );
    if (response.status !== 200) {
      return stringToast('Failed to load order');
    }
    orderList = response.data.data ?? [];
    max = response.data.totalPage ?? 1;
  };

  $effect(() => {
    endDate;
    page = 1;
    max = 1;
  });

  $effect(() => {
    if (show) {
      endDate;
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
<Collapse title='Order' onclick={getOrderList} bind:show>
  <PaginationNavigationPanel
    bind:page
    bind:max
    onreload={getOrderList}
  />
  <DatePicker bind:value={endDate} label="End Date"/>
  <FormInput label="Linked Order Id" bind:value={linkedOrderId}/>
  {#if orderList.length > 0}
    <Table5 itemList={orderList} pincols pinrows>
      {#snippet header()}
        <td>Id</td>
        <td>Date</td>
        <td>Order Type</td>
        <td>Order Code</td>
        <td></td>
        <td></td>
        <td>Linked</td>
        <td>Salesname</td>
        <td>Delivery Type</td>
        <td>Status</td>
        <td>Payment</td>
        <td>Payment Status</td>
        <td>Payment Link Status</td>
        <th>Total</th>
      {/snippet}

      {#snippet content(order)}
        <td><NoWrap>{order.id}</NoWrap></td>
        <td><NoWrap>{order.createdAt}</NoWrap></td>
        <td>{order.orderType}</td>
        <td><NoWrap>{order.orderCode}</NoWrap></td>
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
        <td>{order.linkedOrder.length}</td>
        <td><NoWrap>{order.salesName}</NoWrap></td>
        <td>{order.deliveryType}</td>
        <td>{order.status}</td>
        <td><NoWrap>{order.paymentTerm}</NoWrap></td>
        <td><NoWrap>{order.paymentStatus}</NoWrap></td>
        <td><NoWrap>{order.paymentLinkStatus}</NoWrap></td>
        <th>{order.grandTotal}</th>
      {/snippet}
    </Table5>
  {/if}
</Collapse>

