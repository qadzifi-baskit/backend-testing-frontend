<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { SellerAdminStore } from '@/store/store';
  import type { Company } from '@/types';
  import axios from 'axios';

  type Props = {
    host?: string,
    showHost?: boolean,
  };
  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    showHost = $bindable(true),
  }:Props = $props();
  const client = axios.create({ baseURL: host });

  let clientType = $state('WEB_CMS');
  let username = $state('nagamas@testing.com');
  let password = $state('12345678');
  let companyId = $state('');

  async function getMyCompany() {
    if (!$SellerAdminStore.loggedIn) return;
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  listenDoAuth(() => {
    companyId = '';
  });
  listenAuthSuccess(getMyCompany);
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
    {client}
  />
  <div class="divider"></div>
  <Auth
    store={SellerAdminStore}
    {client}
    bind:username
    bind:password
  />
  <div class="divider"></div>
  <ProductManagement
    store={SellerAdminStore}
    {client}
    bind:companyId
  />
  <div class="divider"></div>
  <InventoryList {client} store={SellerAdminStore}/>
</div>
