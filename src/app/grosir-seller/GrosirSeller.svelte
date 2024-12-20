<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import FieldTeamManagement from '@/components/molecules/FieldTeamManagement.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { OrderTypeEnum } from '@/lib/enum';
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
  <FieldTeamManagement
    {client}
    role="GROSIR_ADMIN"
    bind:companyId
    title="Grosir Admin Management"
    store={GrosirSellerStore}
  />
  <div class="divider"></div>
  <FieldTeamManagement
    {client}
    role="GROSIR_CASHIER"
    bind:companyId
    title="Grosir Cashier Management"
    store={GrosirSellerStore}
  />
  <div class="divider"></div>
  <FieldTeamManagement
    {client}
    role={['GROSIR_ADMIN', 'GROSIR_CASHIER']}
    bind:companyId
    title="Grosir Admin/Cashier Management"
    store={GrosirSellerStore}
  />
  <div class="divider"></div>
  <ProductManagement
    store={GrosirSellerStore}
    {client}
    bind:companyId
  />
  <div class="divider"></div>
  <InventoryList {client} store={GrosirSellerStore}
    {companyId}
    bind:userId
    isGrosir
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
        orderType={OrderTypeEnum.GROSIR_OFFLINE}
      />
    </div>
  </div>
  <div class="divider"></div>
  <OrderList
    {client}
    store={GrosirSellerStore}
    {companyId}
    orderType={OrderTypeEnum.GROSIR_OFFLINE}
  />
</div>
