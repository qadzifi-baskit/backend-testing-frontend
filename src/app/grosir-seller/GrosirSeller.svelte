<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { GrosirSellerStore } from '@/store/store';
  import type { Company } from '@/types';
  import axios from 'axios';

  type Props = {
    host?: string,
    showHost?: boolean,
  };
  let {
    host = $bindable(import.meta.env.VITE_API_HOST),
    showHost = $bindable(true),
  }:Props = $props();
  const client = axios.create({ baseURL: host });

  let clientType = $state('WEB_CMS');
  let username = $state('nagamas@testing.com');
  let password = $state('12345678');
  let companyId = $state('');
  let userId = $state('');

  async function getMyCompany() {
    if (!$GrosirSellerStore.loggedIn) return;
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    userId = (response.data?.data?.id)?.id ?? '';
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  let customerId:string|undefined = $state();

  listenDoAuth(() => {
    companyId = '';
  });
  listenAuthSuccess(getMyCompany);

  let memberLevel = $state<string|null>(null);
</script>

<div class="p-6 bg-[#27303b]">
  <Config
    bind:host
    bind:clientType
    {showHost}
    {client}
  />
  <div class="divider"></div>
  <SellerRegister
    showEmail
    helpGenerateEmail
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={GrosirSellerStore}
    {client}
    bind:username
    bind:password
  />
  <div class="divider"></div>
  <ProductManagement
    store={GrosirSellerStore}
    {client}
    bind:companyId
    addOptions={{ tierAmount: 5 }}
  />
  <div class="divider"></div>
  <InventoryList {client} store={GrosirSellerStore}
    {companyId}
    bind:userId
  />
  <div class="divider"></div>
  <div class="flex w-full rounded-box">
    <div class="card bg-base-300 rounded-box grid flex-grow w-2/5 h-fit">
      <InventoryList isOrder {client} store={GrosirSellerStore}
        {companyId}
        bind:memberLevel
        bind:userId
      />
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid flex-grow w-2/5 h-fit">
      <BuyerCart store={GrosirSellerStore}
        {client}
        bind:memberLevel
        bind:userId={customerId}
      />
    </div>
  </div>
</div>
