<script lang="ts">
  import Modal from '@/components/Modal.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import Order from '@/components/molecules/Order.svelte';
  import ProductList from '@/components/molecules/ProductList.svelte';
  import { writable } from 'svelte/store';
  import Collapse from '../../components/Collapse.svelte';
  import Auth from '../../components/molecules/Auth.svelte';
  import type { Warehouse } from '../../types';
  import './buyer.css';
  import { listenAuthSuccess } from '@/event';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { BuyerStore } from '@/store/store';
  import type { AppConfig } from '@/types/app';

  type Props = {
    host?: string,
    config?: AppConfig,
  };
  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    config = 'host',
  }:Props = $props();
  const client = createAxiosInstance({ baseURL: host });

  const qtyMap:Record<string, number> = {};
  const warehouseList = writable(<Warehouse[]>[]);
  let userId = '';
  let walletId = '';
  let clientType = $state('BASKIT_SHOP');
  let balance = $state(0);
  let username = $state('eight.one@gmail.com');
  let password = $state('12345678');
  let warehouseOptions = [<[string, string]>['', 'All']];

  warehouseList.subscribe((value) => {
    warehouseOptions = [['', 'All']];
    value.forEach((wh) => warehouseOptions.push(<[string, string]>[wh.id, wh.name]));
  });

  const getWarehouse = async () => {
    const response = await client.get('/warehouse');
    if (response.status === 200) {
      warehouseList.set(response.data.data);
    }
  };

  const resetQty = () => {
    for (const key in qtyMap) {
      delete qtyMap[key];
    }
  };

  const getBalance = async () => {
    const response = await client.get(`/wallet/${userId}`);
    if (response.status === 200) {
      walletId = response.data.data.id;
      balance = response.data.data.balance;
    }
  };

  listenAuthSuccess(() => {
    getBalance();
    getWarehouse();
  });

  let topUpDialog = $state<HTMLDialogElement>();
  let topUpAmount = $state(0);
  const onTopUp = () => {
    topUpDialog?.showModal();
  };
  let topUpPageURL = $state('');
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
      onclick={doTopUp}
      class="btn btn-secondary"
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
<div id="root" class="p-6">
  <Config
    bind:clientType
    show={config}
    {client}
  />
  <div class="divider"></div>
  <Auth
    {client}
    store={BuyerStore}
    bind:username
    bind:password
  />
  {#if $BuyerStore.loggedIn}
    <div class="divider"></div>
    <Collapse title="Profile">
      <button onclick={getBalance} class="btn btn-secondary">Get Balance</button>
      <span>Balance: {balance}</span>
      <button onclick={onTopUp} class="btn btn-secondary">Top Up</button>
    </Collapse>
    <div class="divider"></div>
    <div class="flex w-full rounded-box">
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <ProductList
          {userId}
          {client}
        />
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <BuyerCart {userId} onordercreated={resetQty}/>
      </div>
    </div>
    <div class="divider"></div>
    <Order {client} userId={userId}/>
    <div class="divider"></div>
  {/if}
</div>

<style></style>
