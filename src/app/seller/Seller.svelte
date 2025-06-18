<script lang="ts">
  import Auth from '@/components/molecules/Auth.svelte';
  import BuyerCart from '@/components/molecules/BuyerCart.svelte';
  import CartDraftManagement from '@/components/molecules/CartDraftManagement.svelte';
  import Config from '@/components/molecules/Config.svelte';
  import DocumentManagement from '@/components/molecules/DocumentManagement.svelte';
  import ExternalSalesManagament from '@/components/molecules/ExternalSalesManagament.svelte';
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
  import { stringToast } from '@/lib/helper/toast';
  import { createAuthStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { AppConfig } from '@/types/app';
  import type { OrderContext, UserContext } from '@/types/context';
  import { writable } from 'svelte/store';

  type Props = {
    host?: string,
    config?: AppConfig,
  };
  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    config = 'host',
  }:Props = $props();
  let element:HTMLElement|undefined = $state();
  const store = createAuthStore();
  const client = createAxiosInstance({ baseURL: host });
  const orderContext = writable<OrderContext>({
    paymentTypeList: [],
  });
  const userContext = writable<UserContext>({});
  const orderTypeList:OrderTypeEnum[] = [
    OrderTypeEnum.OFFLINE,
    OrderTypeEnum.SELLER_SALES_ORDER,
    OrderTypeEnum.SELLER_PURCHASE_ORDER,
  ];

  Context.set('order', orderContext);
  Context.set('user', userContext);
  Context.set('client', client);
  Context.set('auth', store);

  let clientType = $state('WEB_CMS');
  let username = $state('david@gmail.com');
  let password = $state('12345678');
  let companyId = $state('');
  let selectedOrderType = $state(OrderTypeEnum.OFFLINE);

  async function getMyCompany() {
    if (!$store.loggedIn) return;
    userContext.set({
      id: $store.userId,
    });
    const response = await client.get('/users/me');
    if (response.status !== 200) return;
    companyId = (<Company[]|undefined>response.data?.data?.companies)?.[0]?.id ?? '';
  }

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

  $effect(() => {
    if (element) {
      listenDoAuth(() => {
        companyId = '';
      }, {}, element);
      listenAuthSuccess(() => {
        getMyCompany();
        getPaymentType();
      }, {}, element);
    }
  });
</script>

<div bind:this={element} class="p-6">
  <Config bind:host bind:clientType show={config} {client}/>
  <div class="divider"></div>
  <SellerRegister {client}/>
  <div class="divider"></div>
  <Auth {store} {client} bind:username bind:password bind:element/>
  {#if companyId}
    <div class="divider"></div>
    <FieldTeamManagement role="SELLER_ADMIN" {companyId} title="Seller Admin Management"/>
    <div class="divider"></div>
    <ProductManagement {companyId}/>
    <div class="divider"></div>
    <InventoryList {companyId}/>
    <div class="divider"></div>
    <UserOfflineManagement {companyId}/>
    <div class="divider"></div>
    <ExternalSalesManagament
      {client}
      {companyId}
    />
    <div class="divider"></div>
    <div class="flex w-full rounded-box">
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <InventoryList
          order
          ordertype={orderTypeList}
          {companyId}
          bind:selectedOrderType
        />
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
    <CartDraftManagement
      {client}
      {companyId}
    />
    <div class="divider"></div>
    <OrderList {companyId} orderType={orderTypeList}/>
    <div class="divider"></div>
    <DocumentManagement/>
  {/if}
</div>
