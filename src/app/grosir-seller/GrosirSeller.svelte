<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import FieldTeamManagement from '@/components/molecules/FieldTeamManagement.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import UserOfflineManagement from '@/components/molecules/UserOfflineManagement.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { apiEnv } from '@/lib/config/env.svelte';
  import { OrderTypeEnum } from '@/lib/enum';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { GrosirSellerStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { AppConfig } from '@/types/app';

  type Props = {
    host?: string,
    config?: AppConfig,
  };
  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    config = 'host',
  }:Props = $props();
  const client = createAxiosInstance({ baseURL: host });

  let clientType = $state('WEB_CMS');
  let username = $state('nagamas@testing.com');
  let password = $state('12345678');
  let companyId = $state('');

  Context.set('client', client);
  Context.set('auth', GrosirSellerStore);

  async function getMyCompany() {
    if (!$GrosirSellerStore.loggedIn) return;
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  let customerId:string|undefined = $state();

  listenDoAuth(() => {
    companyId = '';
  });
  listenAuthSuccess(getMyCompany);

  let memberLevel = $state<string|null>(null);
</script>

<div class="p-6">
  <Config
    bind:clientType
    show={config}
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
    role="GROSIR_ADMIN"
    bind:companyId
    title="Grosir Admin Management"
  />
  <div class="divider"></div>
  <FieldTeamManagement
    role="GROSIR_CASHIER"
    bind:companyId
    title="Grosir Cashier Management"
  />
  <div class="divider"></div>
  <FieldTeamManagement
    role={['GROSIR_ADMIN', 'GROSIR_CASHIER']}
    bind:companyId
    title="Grosir Admin/Cashier Management"
  />
  <div class="divider"></div>
  <UserOfflineManagement bind:companyId/>
  <div class="divider"></div>
  <ProductManagement bind:companyId/>
  <div class="divider"></div>
  <InventoryList {companyId} grosir/>
  <div class="divider"></div>
  <div class="flex w-full rounded-box">
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <InventoryList order {companyId} bind:memberLevel/>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
      <BuyerCart
        bind:memberLevel
        bind:userId={customerId}
        ordertype={OrderTypeEnum.GROSIR_OFFLINE}
      />
    </div>
  </div>
  <div class="divider"></div>
  <OrderList {companyId} orderType={OrderTypeEnum.GROSIR_OFFLINE}/>
</div>
