<script lang="ts">
  import './buyer.css';
  import Config from '@/components/molecules/Config.svelte';
  import axios from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaFloppyDisk, FaTrashCan } from 'svelte-icons-pack/fa';
  import type { MouseEventHandler } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import Collapse from '../../components/Collapse.svelte';
  import Table from '../../components/Table.svelte';
  import Auth from '../../components/molecules/Auth.svelte';
  import type { Cart, PaymentType, Product, Warehouse, WarehouseDetail } from '../../types';
  import Select from '@/components/Select.svelte';
  import Order from '@/components/molecules/Order.svelte';
  import Modal from '@/components/Modal.svelte';

  export let host = 'https://api-beta.baskit.app/v2';
  const client = axios.create({ baseURL: host });

  const userId = writable('');
  const qtyMap:Record<string, number> = {};
  const cartQtyMap:Record<string, number> = {};
  const productList = writable(<Product[]>[]);
  const cartList = writable(<Cart[]>[]);
  const paymentTypeList = writable(<PaymentType[]>[]);
  const warehouseList = writable(<Warehouse[]>[]);
  let walletId = '';
  let clientType = 'BASKIT_SHOP';
  let balance = 0;
  let username = 'eight.one@gmail.com';
  let password = '12345678';
  let selectedPaymentType = '';
  let companyId:string|undefined = undefined;
  let warehouseOptions = [<[string, string]>['', 'All']];

  $: {
    client.defaults.baseURL = host;
  }

  warehouseList.subscribe((value) => {
    warehouseOptions = [['', 'All']];
    value.forEach((wh) => warehouseOptions.push(<[string, string]>[wh.id, wh.name]));
  });

  const onGetPaymentType = async () => {
    const paymentResponse = await client.get('/payment-type', {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (paymentResponse.status === 200) {
      paymentTypeList.set(paymentResponse.data.data);
    }
  };

  productList.subscribe((value) => {
    value.forEach(({ id }) => { qtyMap[id] = 0 });
  });

  const onGetWarehouse = async () => {
    const response = await client.get('/warehouse');
    if (response.status === 200) {
      warehouseList.set(response.data.data);
    }
  };

  const onGetProduct = async () => {
    const query:Record<string, string> = {};
    if (companyId) {
      query.id = companyId;
    }
    const params = new URLSearchParams(query);
    const response = await client.get(`/product/search?${params.toString()}`);
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productList.set((response.data.data as any[]).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prev, curr) => [...prev, ...(curr.product as any[]).map((value) => ({
          ...value,
          warehouse: curr.wareHouse.name,
        }))],
        [],
      ));
    }
  };

  $: {
    companyId;
    onGetProduct();
  }

  const onAddProduct = ({
    productId,
    companyId,
    warehouse,
    id: inventoryId,
    priceTiers: [{ id: inventoryPriceTierId }],
  }: Product): MouseEventHandler<HTMLButtonElement> => {
    return async () => {
      await client.post('/cart', {
        qty: qtyMap[inventoryId],
        productId,
        userId: $userId,
        companyId,
        inventoryId,
        inventoryPriceTierId,
        wareHouse: warehouse,
      });
      onGetCart();
    };
  };

  const onGetCart = async () => {
    const response = await client.get('/order');
    if (response.status === 200) {
      const cartOrderList:{
        wareHouse: WarehouseDetail,
        product: Cart[],
      }[] = response.data.data;
      cartList.set(cartOrderList.reduce(
        (prev, curr) => [...prev, ...(curr.product.map(
          (cart) => ({
            ...cart,
            warehouse: curr.wareHouse.name,
          }),
        ))],
        <Cart[]>[],
      ));
    }
  };

  const onCreateOrder = async () => {
    const response = await client.post('/order', {
      paymentTypeId: selectedPaymentType,
      product: $cartList.map((value) => ({
        cartId: value.id,
        inventoryId: value.inventoryId,
        productId: value.productId,
        qty: value.qty,
        price: value.sellingPrice,
        companyId: value.companyId,
      })),
      userId: $userId,
    });
    if (response.status === 200) {
      for (const key in qtyMap) {
        delete qtyMap[key];
      }
    }
  };

  const onGetBalance = async () => {
    const response = await client.get(`/wallet/${$userId}`);
    if (response.status === 200) {
      walletId = response.data.data.id;
      balance = response.data.data.balance;
    }
  };

  const updateCartQty = async (cartId: string, qty: number) => {
    const response = await client.patch(`/cart/${cartId}`, {
      qty,
    });
    if (response.status === 200) {
      for (const key in cartQtyMap) {
        delete cartQtyMap[key];
      }
      onGetCart();
    }
  };

  const onAuth:MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      userId.set(response.data?.data?.id);
      client.defaults.headers.common = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      onGetBalance();
      onGetPaymentType();
      onGetWarehouse();
      onGetProduct();
      onGetCart();
    }
  };
  let topUpDialog:HTMLDialogElement;
  let topUpAmount = 0;
  const onTopUp = () => {
    topUpDialog?.showModal();
  };
  let topUpPageURL = '';
  const doTopUp = async () => {
    const response = await client.post('/wallet/topup/request', {
      id: walletId,
      amount: topUpAmount,
    });
    if (response.status === 200) {
      topUpPageURL = response?.data?.data?.invoiceUrl;
    }
  };
</script>

<Modal
  bind:dialog={topUpDialog}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Amount</span>
      </div>
      <input type="number" placeholder="amount" bind:value={topUpAmount} class="input input-bordered w-full max-w-xs" />
    </label>
    <button
      on:click={doTopUp}
      class="btn bg-slate-600"
    >
      Top Up
    </button>
    <iframe
      class="w-full grow"
      src={topUpPageURL}
      title="Top Up Page"
      frameborder="0"
    ></iframe>
  </div>
</Modal>
<div id="root" class="p-6 bg-[#27303b]">
  <Config
    bind:host
    bind:clientType
    showHost={false}
  />
  <div class="divider"></div>
  <Auth
    bind:username
    bind:password
    onAuth={onAuth}
  />
  <div class="divider"></div>
  <Collapse title="Profile">
    <button on:click={onGetBalance} class="btn bg-slate-600">Get Balance</button>
    <span>Balance: {balance}</span>
    <button on:click={onTopUp} class="btn bg-slate-600">Top Up</button>
  </Collapse>
  <div class="divider"></div>
  <div class="flex w-full rounded-box">
    <div class="card bg-base-300 rounded-box grid flex-grow w-2/5 h-fit">
      <Collapse class="overflow-x-auto" onClick={onGetProduct} title="Product List">
        <Select
          showValue
          options={warehouseOptions}
          bind:value={companyId}
        />
        <button class="btn" on:click={onGetProduct}>Get Product</button>
        {#if $productList.length > 0}
          <Table itemList={$productList}>
            <svelte:fragment slot="header">
              <th>Stock</th>
              <th>Status</th>
              <th>Price</th>
              <th>Qty</th>
              <th></th>
              <th>Name</th>
            </svelte:fragment>
            <svelte:fragment slot="item" let:item>
              <td>{item.stock}</td>
              <td>{item.status}</td>
              <td>{item.sellingPrice}</td>
              <td>
                <input type="number" placeholder="qty" value={qtyMap[item.id]} class="input input-bordered w-24 max-w-xs"
                  on:change={(e) => { qtyMap[item.id] = Number(e.currentTarget.value) }}
                />
              </td>
              <td>
                <button class="btn bg-slate-600" on:click={onAddProduct(item)}>Add</button>
              </td>
              <td>{item.name}</td>
            </svelte:fragment>
          </Table>
        {/if}
      </Collapse>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid flex-grow w-2/5 h-fit">
      <Collapse class="overflow-x-auto" onClick={onGetCart} title="Order Summary">
        <button class="btn" on:click={onGetCart}>Get Cart</button>
        {#if $cartList.length > 0}
          <Table itemList={$cartList}>
            <svelte:fragment slot="header">
              <th>
                Qty
              </th>
              <th></th>
              <th></th>
              <th>
                Warehouse
              </th>
              <th>
                Name
              </th>
            </svelte:fragment>
            <svelte:fragment slot="item" let:item={cart}>
              <td>
                <input type="number" value={cart.qty} class="input input-bordered w-24 max-w-xs"
                  on:change={(e) => { cartQtyMap[cart.id] = Number(e.currentTarget.value) }}
                >
              </td>
              <td>
                <button
                  on:click={() => updateCartQty(cart.id, cartQtyMap[cart.id])}
                  class="btn bg-slate-600"
                >
                  <Icon src={FaFloppyDisk}/>
                </button>
              </td>
              <td>
                <button
                  on:click={() => updateCartQty(cart.id, 0)}
                  class="btn bg-slate-600"
                >
                  <Icon src={FaTrashCan}/>
                </button>
              </td>
              <td>
                {cart.warehouse}
              </td>
              <td>
                {cart.fullName}
              </td>
            </svelte:fragment>
          </Table>
        {/if}
        <div>
          <select bind:value={selectedPaymentType} class="select select-bordered w-full max-w-xs">
            <option value="" disabled selected>Payment Type</option>
            {#each $paymentTypeList as paymentType}
              <option value={paymentType.id}>{paymentType.name}</option>
            {/each}
          </select>
          <button class="btn" on:click={onCreateOrder} disabled={selectedPaymentType === ''}>Create Order</button>
        </div>
      </Collapse>
    </div>
  </div>
  <div class="divider"></div>
  <Order {client} userId={$userId}/>
  <div class="divider"></div>
</div>

<style></style>
