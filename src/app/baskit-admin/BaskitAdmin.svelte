<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import CategoryManagement from '@/components/molecules/CategoryManagement.svelte';
  import CompanyTypeManagement from '@/components/molecules/CompanyTypeManagement.svelte';
  import CompanyUserManagement from '@/components/molecules/CompanyUserManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import EntityCategoryManagement from '@/components/molecules/EntityCategoryManagement.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerList from '@/components/molecules/SellerList.svelte';
  import TutorialManagement from '@/components/molecules/TutorialManagement.svelte';
  import UomCategoryManagement from '@/components/molecules/UomCategoryManagement.svelte';
  import UomManagement from '@/components/molecules/UomManagement.svelte';
  import { OrderTypeEnum } from '@/lib/enum';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { createAuthStore } from '@/store/store';
  import type { AppConfig } from '@/types/app';

  type Props = {
    config?: AppConfig,
  };

  let {
    config: configList = 'host',
  }: Props = $props();

  const { config } = Context.strict;

  let clientType = $state('WEB_CMS');
  let username = $state('boa@baskit.app');
  let password = $state('12345678');

  const client = createAxiosInstance({ baseURL: config.host });
  const auth = createAuthStore();

  Context.set('auth', auth);
  Context.set('client', client);
</script>

<div id="root" class="p-6">
  <Config
    bind:clientType
    show={configList}
    {client}
  />
  <div class="divider"></div>
  <Auth
    {client}
    store={auth}
    bind:username
    bind:password
  />
  {#if $auth.loggedIn}
    <div class="divider"></div>
    <CompanyUserManagement/>
    <div class="divider"></div>
    <UomManagement/>
    <div class="divider"></div>
    <UomCategoryManagement/>
    <div class="divider"></div>
    <CategoryManagement manage/>
    <div class="divider"></div>
    <OrderList orderType={[OrderTypeEnum.SHOP, OrderTypeEnum.ONLINE]}/>
    <div class="divider"></div>
    <ProductManagement/>
    <div class="divider"></div>
    <InventoryList/>
    <div class="divider"></div>
    <SellerList/>
    <div class="divider"></div>
    <CompanyTypeManagement {client}/>
    <div class="divider"></div>
    <TutorialManagement/>
    <div class="divider"></div>
    <EntityCategoryManagement addcategory modify/>
  {/if}
</div>
