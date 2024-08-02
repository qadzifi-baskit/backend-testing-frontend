<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import Modal from '@/components/Modal.svelte';
  import Select from '@/components/Select.svelte';
  import Table from '@/components/Table.svelte';
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import CreateOfflineUser from '@/components/molecules/CreateOfflineUser.svelte';
  import OrderDetail from '@/components/molecules/OrderDetail.svelte';
  import type { Inventory, Order, PaymentType, UpdateOrderData, UserOffline } from '@/types';
  import axios from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  let host = 'http://127.0.0.1';
  let companyId:string|null = null;
  let inventory:Inventory[] = [];
  let paymentTypeList:PaymentType[] = [];
  let paymentTypeId = '';
  let inboundQty = 0;
  let inboundPrice = 0;
  let shippingCost = 0;
  let notes = '';
  let selectedItem:Inventory|null = null;
  let supllierList:UserOffline[] = [];
  let supplierId = '';
  let inboundList:Order[] = [];
  let selectedInbound:Order|null = null;

  const client = axios.create({
    baseURL: host,
  });
  $: {
    client.defaults.baseURL = host;
  }
  let clientType = 'WEB_CMS';
   
  let userId = '';
  let username = 'david@gmail.com';
  let password = '12345678';

  const getMe = async () => {
    const response = await client.get('/users/me');
    if (response.status === 200) {
      companyId = response.data?.data?.companies?.[0]?.id ?? null;
    }
  };
  const getPaymentType = async () => {
    const response = await client.get('/payment-type');
    if (response.status === 200) {
      paymentTypeList = response.data?.data ?? [];
      paymentTypeId = paymentTypeList?.[0]?.id ?? '';
    }
  };
  const getSupplier = async () => {
    const params = new URLSearchParams();
    params.append('customerType', 'SUPPLIER');
    if (companyId) {
      params.append('companyId', companyId);
    }
    const response = await client.get('/user-offline', {
      params,
    });
    if (response.status === 200) {
      supllierList = response.data?.data ?? [];
    }
  };
  $: if (userId) {
    getMe();
    getPaymentType();
  }

  const onAuth = async () => {
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      userId = response.data?.data?.id;
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
    }
  };

  const getInventory = async () => {
    const response = await client.get(`/inventory?companyId=${companyId}`);
    if (response.status === 200) {
      inventory = response.data?.data ?? [];
    }
  };
  $: if (companyId) {
    getInventory();
    getSupplier();
  }

  let inboundDialog:HTMLDialogElement|undefined;

  const onShowCreateinbound = (item: Inventory) => () => {
    selectedItem = item;
    inboundDialog?.showModal();
  };

  const onCreateInbound = async () => {
    if (selectedItem) {
      const response = await client.post('/inventory/stock', {
        paymentTypeId,
        shippingCost,
        supplierId,
        product: [
          {
            inventoryId: selectedItem.id,
            qty: inboundQty,
            price: inboundPrice,
            notes,
          },
        ],
      });
      if (response.status === 200) {
        inboundDialog?.close();
      }
    }
  };

  const onGetInbound = async () => {
    if (userId) {
      const params = new URLSearchParams();
      params.append('$order', 'createdAt');
      params.append('$sort', 'DESC');
      params.append('$limit', '10');
      params.append('$page', '1');
      params.append('orderType', 'INBOUND');
      const response = await client.get('/order/list-order', {
        params,
      });
      if (response.status === 200) {
        inboundList = response.data?.data ?? [];
      }
    }
  };

  let updateStatusDialog:HTMLDialogElement|undefined;
  let newStatus = 'RESTOCK_COMPLETED';
  const onShowUpdateStatus = (inbound: Order) => () => {
    selectedInbound = inbound;
    updateStatusDialog?.showModal();
  };

  const onUpdateInbound = async (data: UpdateOrderData[]) => {
    if (selectedInbound) {
      const response = await client.patch(
        `/order/inbound/status/${selectedInbound.id}`,
        {
          status: newStatus,
          completePayload: data.map(({ id, qty, price }) => ({
            id,
            qty,
            price,
          })),
        },
      );
      if (response.status === 200) {
        updateStatusDialog?.close();
      }
    }
  };

  let createUserOfflineDialog:HTMLDialogElement|undefined;
  const showCreateUserOffline = () => {
    inboundDialog?.close();
    createUserOfflineDialog?.showModal();
  };
  const onCloseCreateUserOffline = () => {
    inboundDialog?.showModal();
  };
  $: if (createUserOfflineDialog) {
    createUserOfflineDialog.addEventListener(
      'close',
      onCloseCreateUserOffline,
    );
  }

  const onUserCreated = () => {
    createUserOfflineDialog?.close();
    inboundDialog?.showModal();
    getSupplier();
  };
</script>

<Config
  bind:host
  bind:clientType
/>
<Modal
  bind:dialog={inboundDialog}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <h3>{selectedItem?.fullName}</h3>
    <Select
      showValue
      options={paymentTypeList.map((val) => [val.id, val.name])}
      bind:value={paymentTypeId}
    />
    <button
      class="btn bg-slate-600"
      on:click={showCreateUserOffline}
    >
      Create Supplier
    </button>
    <Select
      showValue
      options={supllierList.map((val) => [val.id, val.firstName])}
      bind:value={supplierId}
    />
    <div class="divider"></div>
    <label for="">Qty</label>
    <input bind:value={inboundQty} type="number" class="input input-bordered" placeholder="qty" min="1" step="1">
    <div class="divider"></div>
    <label for="">Price</label>
    <input bind:value={inboundPrice} type="number" class="input input-bordered" placeholder="price" min="10" step="10">
    <div class="divider"></div>
    <textarea bind:value={notes} name="notes" class="textarea textarea-bordered" placeholder="notes" id=""></textarea>
    <div class="divider"></div>
    <label for="">Shipping Cost</label>
    <input bind:value={shippingCost} type="number" class="input input-bordered" placeholder="shipping cost" min="0">
    <div class="divider"></div>
    <button class="btn bg-slate-600"
      on:click={onCreateInbound}
    >
      Create Inbound
    </button>
  </div>
</Modal>
<Modal
  bind:dialog={updateStatusDialog}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <h3>
      {selectedInbound?.orderCode}
    </h3>
    <Select
      bind:value={newStatus}
      options={[
        ['RESTOCK_COMPLETED', 'Complete'],
        ['RESTOCK_CANCELLED', 'Cancel'],
      ]}
    />
    <div class="divider"></div>
    {#if selectedInbound}
      <OrderDetail
        onUpdateOrder={onUpdateInbound}
        client={client}
        bind:id={selectedInbound.id}
      />
    {/if}
  </div>
</Modal>
<Modal
  bind:dialog={createUserOfflineDialog}
>
  {#if userId}
    <CreateOfflineUser {onUserCreated} {client}/>
  {/if}
</Modal>
<div class="p-6">
  <Auth
    bind:username
    bind:password
    onAuth={onAuth}
  />
  <div class="divider"></div>
  <Collapse title="Inventory">
    <button class="btn bg-slate-600"
      on:click={getInventory}
    >
      Get Inventory
    </button>
    {#if inventory.length > 0}
      <Table
        itemList={inventory}
      >
        <svelte:fragment slot="header">
          <th>id</th>
          <th></th>
          <th>Stock</th>
          <th>Name</th>
        </svelte:fragment>
        <svelte:fragment slot="item" let:item>
          <td>{item.id}</td>
          <td>
            <button class="btn bg-slate-600"
              on:click={onShowCreateinbound(item)}
            >
              Inbound
            </button>
          </td>
          <td>{item.stock}</td>
          <td>{item.fullName}</td>
        </svelte:fragment>
      </Table>
    {/if}
  </Collapse>
  <div class="divider"></div>
  <Collapse title="Inbound">
    <button class="btn bg-slate-600" on:click={onGetInbound}>Get Inbound</button>
    <Table
      itemList={inboundList}
    >
      <svelte:fragment slot="header">
      </svelte:fragment>
      <svelte:fragment slot="item" let:item>
        <td>{item.id}</td>
        <td>{item.orderCode}</td>
        <td>
          <button
            class="btn bg-slate-600"
            on:click={onShowUpdateStatus(item)}
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td>{item.status}</td>
        <td>{item.grandTotal}</td>
      </svelte:fragment>
    </Table>
  </Collapse>
</div>

<style></style>
