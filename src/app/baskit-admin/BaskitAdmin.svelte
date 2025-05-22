<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import CategoryManagement from '@/components/molecules/CategoryManagement.svelte';
  import CompanyTypeManagement from '@/components/molecules/CompanyTypeManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import EntityCategoryManagement from '@/components/molecules/EntityCategoryManagement.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerList from '@/components/molecules/SellerList.svelte';
  import TutorialManagement from '@/components/molecules/TutorialManagement.svelte';
  import { OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { BaskitAdminStore } from '@/store/store';
  import type { AppConfig } from '@/types/app';
  import axios from 'axios';

  type Props = {
    host?: string,
    config?: AppConfig,
  };

  let {
    host = $bindable('https://api-beta.baskit.app/v2'),
    config = 'host',
  }: Props = $props();

  let clientType = $state('WEB_CMS');
  let username = $state('boa@baskit.app');
  let password = $state('12345678');

  const client = axios.create({ baseURL: host });

  Context.set('auth', BaskitAdminStore);
  Context.set('client', client);
</script>

<div id="root" class="p-6">
  <Config
    bind:host
    bind:clientType
    show={config}
    {client}
  />
  <div class="divider"></div>
  <Auth
    {client}
    store={BaskitAdminStore}
    bind:username
    bind:password
  />
  {#if $BaskitAdminStore.loggedIn}
    <div class="divider"></div>
    <CategoryManagement {client} store={BaskitAdminStore}/>
    <div class="divider"></div>
    <OrderList
      {client}
      store={BaskitAdminStore}
      orderType={[OrderTypeEnum.SHOP, OrderTypeEnum.ONLINE]}
    />
    <div class="divider"></div>
    <ProductManagement {client} store={BaskitAdminStore} />
    <div class="divider"></div>
    <InventoryList {client} store={BaskitAdminStore}/>
    <div class="divider"></div>
    <SellerList {client}/>
    <div class="divider"></div>
    <CompanyTypeManagement {client}/>
    <div class="divider"></div>
    <TutorialManagement {client} store={BaskitAdminStore}/>
    <div class="divider"></div>
    <EntityCategoryManagement addcategory modify/>
  {/if}
</div>
