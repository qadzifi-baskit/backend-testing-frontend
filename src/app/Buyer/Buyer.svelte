<script lang="ts">
  import './buyer.css';
  import Config from '@/components/molecules/Config.svelte';
  import axios from 'axios';
  import type { MouseEventHandler } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import Collapse from '../../components/Collapse.svelte';
  import Auth from '../../components/molecules/Auth.svelte';
  import type { Warehouse } from '../../types';
  import Order from '@/components/molecules/Order.svelte';
  import Modal from '@/components/Modal.svelte';
  import ProductList from '@/components/molecules/ProductList.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';

  export let host = 'https://api-beta.baskit.app/v2';
  const client = axios.create({ baseURL: host });

  const qtyMap:Record<string, number> = {};
  const warehouseList = writable(<Warehouse[]>[]);
  let userId = '';
  let walletId = '';
  let clientType = 'BASKIT_SHOP';
  let balance = 0;
  let username = 'eight.one@gmail.com';
  let password = '12345678';
  let warehouseOptions = [<[string, string]>['', 'All']];

  $: {
    client.defaults.baseURL = host;
  }

  warehouseList.subscribe((value) => {
    warehouseOptions = [['', 'All']];
    value.forEach((wh) => warehouseOptions.push(<[string, string]>[wh.id, wh.name]));
  });

  const onGetWarehouse = async () => {
    const response = await client.get('/warehouse');
    if (response.status === 200) {
      warehouseList.set(response.data.data);
    }
  };

  const onOrderCreated = () => {
    for (const key in qtyMap) {
      delete qtyMap[key];
    }
  };

  const onGetBalance = async () => {
    const response = await client.get(`/wallet/${userId}`);
    if (response.status === 200) {
      walletId = response.data.data.id;
      balance = response.data.data.balance;
    }
  };
  let auth:Record<string, string> = {};

  const onAuth:MouseEventHandler<HTMLButtonElement> = async () => {
    const response = await client.post('/auth', {
      username,
      password,
    });
    if (response.status === 200) {
      userId = response.data?.data?.id ?? '';
      auth = {
        'X-ID': response.data?.data?.id,
        Authorization: response.data?.data?.accessToken,
      };
      client.defaults.headers.common = auth;
      onGetBalance();
      onGetWarehouse();
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
      <ProductList
        {auth}
        {userId}
        {client}
      />
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid flex-grow w-2/5 h-fit">
      <BuyerCart
        {client}
        {auth}
        {userId}
        {onOrderCreated}
      />
    </div>
  </div>
  <div class="divider"></div>
  <Order {client} userId={userId}/>
  <div class="divider"></div>
</div>

<style></style>
