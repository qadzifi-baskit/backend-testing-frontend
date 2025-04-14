<script lang="ts">
  import { OrderTypeEnum } from '@/lib/enum';
  import { stringToast } from '@/lib/helper/toast';
  import { getObjectDiff } from '@/lib/helper/util';
  import { SellerAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { Cart, CartDraftUser, CartDraftUserAddress, CartParent } from '@/types/cart';
  import type { User, UserOffline } from '@/types/user';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import AreaSelectInput from '../atoms/AreaSelectInput.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import DatePicker from '../DatePicker.svelte';
  import Modal from '../Modal.svelte';
  import BuyerCart from './BuyerCart.svelte';
  import InventoryList from './InventoryList.svelte';
  import UserDropdownSelect from './UserDropdownSelect.svelte';
  import UserOfflineDropdownSelect from './UserOfflineDropdownSelect.svelte';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
    dialog: HTMLDialogElement | undefined,
    item?: CartParent,
    companyId?: string,
    onsuccess?: (data: CartParent) => void
    ondelete?: (data: CartParent) => void
  };
  let {
    client,
    store = SellerAdminStore,
    dialog = $bindable(),
    item = $bindable(),
    companyId = $bindable(),
    onsuccess: onSuccessParent,
    ondelete,
  }: Props = $props();

  const defaultData = {
    customerId: '',
    salesId: '',
    refCode: '',
    creationDate: null,
    customerData: {
      picName: '',
      billingAddress: {
        address: '',
        provinceId: 0,
        regencyId: 0,
        postalCode: '',
      },
      deliveryAddress: {
        address: '',
        provinceId: 0,
        regencyId: 0,
        postalCode: '',
      },
    },
  };

  const newData:Partial<CartParent> = $state({ ...defaultData });

  let show = $state(false);

  async function getCartDraftDetail() {
    if (!item) return;
    stringToast('Loading cart draft detail...');
    const response = await client.get(`/cart/draft/${item.id}`);
    if (response.status !== 200) {
      return stringToast('Failed to load cart draft detail');
    }
    Object.assign(newData, response.data.data);
    return stringToast('Cart draft detail loaded');
  }

  $effect(() => {
    if (item) {
      getCartDraftDetail();
      newData.companyId = companyId;
    } else {
      Object.assign(newData, defaultData);
      delete newData.companyId;
    }
  });

  let salesData:User|undefined = $state();
  let salesName = $state('salesman');
  $effect(() => {
    if (salesData) {
      salesName =`${salesData.profile?.firstName ?? '-'} ${salesData.profile?.lastName ?? '-'}`;
    } else {
      salesName = 'salesman';
    }
  });
  async function getSalesData() {
    if (!newData.salesId) return;
    const response = await client.get(`/users/${newData.salesId}`);
    if (response.status !== 200) {
      return stringToast('Failed to load sales data');
    }
    salesData = response.data.data;
  }
  $effect(() => {
    item?.salesId && getSalesData();
  });

  let customerData:UserOffline|undefined = $state();
  let customerName = $state('customer');
  $effect(() => {
    if (customerData) {
      customerName = `${customerData.firstName ?? '-'} ${customerData.lastName ?? '-'}`;
    } else {
      customerName = 'customer';
    }
  });
  async function getCustomerData() {
    if (!newData.customerId) return;
    const response = await client.get(`/user-offline/${newData.customerId}`);
    if (response.status !== 200) {
      return stringToast('Failed to load customer data');
    }
    customerData = response.data.data;
  }
  $effect(() => {
    item?.customerId && getCustomerData();
  });

  function addressPrehook(payload: Partial<CartDraftUserAddress>): Partial<CartDraftUserAddress> {
    const newPayload: Partial<CartDraftUserAddress> = {};
    if (payload.address) {
      newPayload.address = payload.address;
    }
    if (payload.provinceId) {
      newPayload.provinceId = payload.provinceId;
    }
    if (payload.regencyId) {
      newPayload.regencyId = payload.regencyId;
    }
    if (payload.postalCode) {
      newPayload.postalCode = payload.postalCode;
    }
    return newPayload;
  }

  function customerDataPrehook(payload: Partial<CartDraftUser>): Partial<CartDraftUser> {
    const newPayload: Partial<CartDraftUser> = {};
    if (payload.picName) {
      newPayload.picName = payload.picName;
    }
    if (payload.billingAddress) {
      newPayload.billingAddress = addressPrehook(payload.billingAddress);
    }
    if (payload.deliveryAddress) {
      newPayload.deliveryAddress = addressPrehook(payload.deliveryAddress);
    }
    return newPayload;
  }

  function savePrehook(payload: Partial<CartParent>): Partial<CartParent> {
    const newPayload: Partial<CartParent> = {
      companyId,
    };
    if (payload.salesId) {
      newPayload.salesId = payload.salesId;
    }
    if (payload.customerId) {
      newPayload.customerId = payload.customerId;
    }
    if (payload.refCode) {
      newPayload.refCode = payload.refCode;
    }
    if (payload.creationDate) {
      newPayload.creationDate = payload.creationDate;
    }
    if (payload.customerData) {
      newPayload.customerData = customerDataPrehook(payload.customerData);
    }
    return newPayload;
  }

  function prehook(payload: Partial<CartParent>): Partial<CartParent> {
    if (!item) return savePrehook(payload);
    const newPayload: Partial<CartParent> = getObjectDiff(payload, item);
    newPayload.customerData = payload.customerData;
    return newPayload;
  }

  async function deleteDraft() {
    if (!item) {
      return stringToast('No item selected');
    }
    stringToast('Deleting...');
    const response = await client.delete(`/cart/draft/${item.id}`);
    if (response.status !== 200) {
      return stringToast('Failed to delete');
    }
    if (ondelete) {
      ondelete(item);
    }
    return stringToast('Deleted');
  }

  async function saveDraft(data: Cart[]): Promise<Cart[]> {
    if (!item) {
      stringToast('No item selected');
      return data;
    }
    const payload = prehook(newData);
    const response = await client.patch(`/cart/draft/${item.id}`, payload);
    if (response.status !== 200) {
      stringToast('Failed to save draft');
    }
    return data;
  }

  function onsuccess(data: CartParent): void {
    if (onSuccessParent) {
      onSuccessParent(data);
    }
    if (!item?.id) {
      dialog?.close();
    }
  }

  function onordercreated(): void {
    if (!item?.id) {
      dialog?.close();
    }
  }
</script>

{#snippet addressForm(data: CartDraftUserAddress)}
  <FormInput type="text" placeholder="address" label="Address" bind:value={data.address}/>
  <AreaSelectInput
    {client}
    {store}
    bind:value={data.provinceId}
  />
  <AreaSelectInput
    type="REGENCY"
    {client}
    {store}
    bind:parentId={data.provinceId}
    bind:value={data.regencyId}
  />
  <FormInput type="text" placeholder="postal code" label="Postal Code" bind:value={data.postalCode}/>
{/snippet}

<Modal bind:dialog onopen={() => show = true}>
  <div class="flex flex-col items-start w-full min-h-full h-fit overflow-y-scroll">
    <FormWrapper
      {client}
      class="mb-2"
      path={'/cart/draft' + (item?.id ? `/${item.id}` : '')}
      method={item?.id ? 'PATCH' : 'POST'}
      payload={newData}
      {onsuccess}
      {prehook}
    >
      {#if newData.id}
        <FormInput readonly type="text" placeholder="id" label="Id" bind:value={newData.id}/>
      {/if}
      <span class="fieldset label mb-2">Created At</span>
      <DatePicker
        bind:value={newData.creationDate!}
        onselect={console.log}
      />
      <UserDropdownSelect
        {client}
        bind:value={newData.salesId!}
        roleName="EXTERNAL_SALESMAN"
        label="Salesman"
        bind:placeholder={salesName}
        bind:sellerId={companyId}
      />
      <FormInput readonly type="text" placeholder="sales id" label="Sales Id" bind:value={newData.salesId}/>
      <UserOfflineDropdownSelect
        {client}
        label="Customer"
        bind:placeholder={customerName}
        bind:value={newData.customerId!}
        bind:companyId
      />
      <FormInput readonly type="text" placeholder="customer id" label="Customer Id" bind:value={newData.customerId}/>
      <FormInput type="text" placeholder="ref code" label="Ref Code" bind:value={newData.refCode}/>
      <span class="fieldset-label font-bold mb-2">Billing Address</span>
      {@render addressForm(newData.customerData!.billingAddress!)}
      <span class="fieldset-label font-bold mb-2">Delivery Address</span>
      {@render addressForm(newData.customerData!.deliveryAddress!)}
      <SubmitButton/>
      {#if item?.id}
        <button class="btn btn-secondary" onclick={deleteDraft}>Delete</button>
      {/if}
    </FormWrapper>

    {#if item?.id}
      <InventoryList
        {client}
        store={SellerAdminStore}
        order
        cartCode={item.id}
        bind:companyId
      />
      <div class="mb-2"></div>
      <BuyerCart
        bind:show
        draft
        {store}
        {client}
        orderType={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        prehook={saveDraft}
        bind:cartCode={item.id}
        bind:companyId
      />
    {:else}
      <BuyerCart
        bind:show
        draft
        {store}
        {client}
        orderType={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        {onordercreated}
        bind:companyId
      />
    {/if}
  </div>
</Modal>
