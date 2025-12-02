<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import CartDraftManagement from '@/components/molecules/CartDraftManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import FieldTeamManagement from '@/components/molecules/FieldTeamManagement.svelte';
  import Inventory2Management from '@/components/molecules/Inventory2Management.svelte';
  import InventoryList from '@/components/molecules/InventoryList.svelte';
  import OrderList from '@/components/molecules/OrderList.svelte';
  import ProductManagement from '@/components/molecules/ProductManagement.svelte';
  import SellerRegister from '@/components/molecules/SellerRegister.svelte';
  import { listenAuthSuccess, listenDoAuth } from '@/event';
  import { OrderTypeEnum } from '@/lib/enum';
  import { createAxiosInstance } from '@/lib/helper/axios.svelte';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { createAuthStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { AppConfig } from '@/types/app';
  import type { OrderContext, UserContext } from '@/types/context';
  import { writable } from 'svelte/store';

  type Props = {
    config?: AppConfig,
  };
  let {
    config: configList = 'host',
  }: Props = $props();

  const { config } = Context.strict;

  const client = createAxiosInstance({ baseURL: config.host });
  const store = createAuthStore();
  const userContext = writable<UserContext>({});
  const orderContext = writable<OrderContext>({
    paymentTypeList: [],
  });

  Context.set('order', orderContext);
  Context.set('auth', store);
  Context.set('user', userContext);
  Context.set('client', client);

  const orderTypeList:OrderTypeEnum[] = [
    OrderTypeEnum.BSC_SELLER_PURCHASE_ORDER,
    OrderTypeEnum.BSC_SELLER_SALES_ORDER,
  ];

  let clientType = $state('WEB_CMS');
  let username = $state('supercompany.turbine439@passinbox.com');
  let password = $state('Samagan!23');
  let companyId = $state('');
  let selectedOrderType = $state(OrderTypeEnum.BSC_SELLER_PURCHASE_ORDER);
  let customerId:string|undefined = $state();

  async function getPaymentType() {
    if (!$store.loggedIn) return;
    stringToast('Loading payment type...');
    const response = await client.get('/payment-type', {
      headers: {
        'X-CLIENT': clientType,
      },
    });
    if (response.status !== 200) return stringToast('Failed to load payment type');
    orderContext.update((value) => (
      {
        ...value,
        paymentTypeList: response.data?.data ?? [],
      }
    ));
    stringToast('Payment type loaded');
  };

  async function getMyCompany() {
    if (!$store.loggedIn) return;
    userContext.set({
      id: $store.userId,
    });
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

  $effect(() => {
    listenDoAuth(() => {
      companyId = '';
    });
    listenAuthSuccess(() => {
      getMyCompany();
      getPaymentType();
    });
  });
</script>

<div id="root" class="p-6">
  <Config
    bind:clientType
    show={configList}
    {client}
  />
  <div class="divider"></div>
  <SellerRegister/>
  <div class="divider"></div>
  <Auth {store} {client}
    bind:username
    bind:password
  />
  {#if $store.loggedIn && companyId}
    <div class="divider"></div>
    <FieldTeamManagement
      role={[
        'BSC_SUPER_ADMIN',
        'BSC_ADMIN',
        'BSC_ACCOUNT_MANAGER',
        'BSC_PURCHASING',
        'BSC_FINANCE',
        'BSC_OFFICER',
      ]}
      {companyId}
    />
    <div class="divider"></div>
    <ProductManagement {companyId}/>
    <div class="divider"></div>
    <InventoryList bind:companyId/>
    <div class="divider"></div>
    <Inventory2Management {companyId}/>
    <div class="divider"></div>
    <div class="flex w-full rounded-box">
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <!-- name of each tab group should be unique -->
        <div class="tabs tabs-box">
          <input type="radio" name="order-tab" class="tab" aria-label="Old" checked/>
          <div class="tab-content bg-base-100 border-base-300 h-fit">
            <InventoryList
              order
              ordertype={orderTypeList}
              {companyId}
              bind:selectedOrderType
            />
          </div>

          <input type="radio" name="order-tab" class="tab" aria-label="New"/>
          <div class="tab-content bg-base-100 border-base-300 h-fit">
            <Inventory2Management {companyId} isorder/>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <BuyerCart
          bind:userId={customerId}
          {companyId}
          ordertype={orderTypeList}
          bind:selectedOrderType
        />
      </div>
    </div>
    <div class="divider"></div>
    <CartDraftManagement {companyId}/>
    <div class="divider"></div>
    <OrderList {companyId} orderType={orderTypeList}/>
  {/if}
</div>

<style>
  div.tab-content {
    @apply h-fit;
  }
</style>
