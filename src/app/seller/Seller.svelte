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
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { SellerAdminStore } from '@/store/store';
  import type { Company } from '@/types';
  import type { OrderContext } from '@/types/context';
  import axios from 'axios';
  import { writable } from 'svelte/store';

  type Props = {
    host?: string,
    showHost?: boolean,
  };
  let {
    host = $bindable(apiEnv.DEFAULT_API_HOST),
    showHost = $bindable(true),
  }:Props = $props();
  let element:HTMLElement|undefined = $state();
  const client = axios.create({ baseURL: host });
  const orderContext = writable<OrderContext>({
    paymentTypeList: [],
  });
  Context.set('order', orderContext);

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

  let customerId:string|undefined = $state();

  const getPaymentType = async () => {
    if (!$SellerAdminStore.loggedIn) return;
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
    bind:element
  />
  {#if companyId}
    <div class="divider"></div>
    <FieldTeamManagement
      {client}
      role="SELLER_ADMIN"
      {companyId}
      title="Seller Admin Management"
      store={SellerAdminStore}
    />
    <div class="divider"></div>
    <ProductManagement
      store={SellerAdminStore}
      {client}
      {companyId}
    />
    <div class="divider"></div>
    <InventoryList {client} store={SellerAdminStore} {companyId} />
    <div class="divider"></div>
    <UserOfflineManagement
      {client}
      store={SellerAdminStore}
      {companyId}
    />
    <div class="divider"></div>
    <ExternalSalesManagament
      {client}
      {companyId}
    />
    <div class="divider"></div>
    <div class="flex w-full rounded-box">
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <InventoryList {client} store={SellerAdminStore}
          order
          {companyId}
        />
      </div>
      <div class="divider divider-horizontal"></div>
      <div class="card bg-base-300 rounded-box grid grow w-2/5 h-fit">
        <BuyerCart
          store={SellerAdminStore}
          {client}
          bind:userId={customerId}
          {companyId}
          orderType={OrderTypeEnum.OFFLINE}
        />
      </div>
    </div>
    <div class="divider"></div>
    <CartDraftManagement
      {client}
      {companyId}
    />
    <div class="divider"></div>
    <OrderList
      {client}
      store={SellerAdminStore}
      {companyId}
      orderType={[
        OrderTypeEnum.OFFLINE,
        OrderTypeEnum.SELLER_PURCHASE_ORDER,
      ]}
    />
    <div class="divider"></div>
    <DocumentManagement {client}/>
  {/if}
</div>
