<script lang="ts">
  import { OrderTypeEnum } from '@/lib/enum';
  import { stringToast } from '@/lib/helper/toast';
  import { SellerAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { CartDraftUser, CartDraftUserAddress, CartParent } from '@/types/cart';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import AreaSelectInput from '../atoms/AreaSelectInput.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import Modal from '../Modal.svelte';
  import BuyerCart from './BuyerCart.svelte';

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
    onsuccess,
    ondelete,
  }: Props = $props();

  const newData:Partial<CartParent> = $state({
    salesId: '',
    refCode: '',
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
  });

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
    } else {
      newData.salesId = '';
    }
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
    if (payload.customerData) {
      newPayload.customerData = customerDataPrehook(payload.customerData);
    }
    return newPayload;
  }

  function prehook(payload: Partial<CartParent>): Partial<CartParent> {
    if (!item) return savePrehook(payload);
    const newPayload: Partial<CartParent> = {
      companyId,
    };
    if (payload.salesId !== item.salesId) {
      newPayload.salesId = payload.salesId;
    }
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

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      {client}
      path={'/cart/draft' + (item?.id ? `/${item.id}` : '')}
      method={item?.id ? 'PATCH' : 'POST'}
      payload={newData}
      {onsuccess}
      {prehook}
    >
      {#if newData.id}
        <FormInput readonly type="text" placeholder="id" label="Id" bind:value={newData.id}/>
      {/if}
      <FormInput type="text" placeholder="sales id" label="Sales Id" bind:value={newData.salesId}/>
      <FormInput type="text" placeholder="ref code" label="Ref Code" bind:value={newData.refCode}/>
      <span class="label-text font-bold">Billing Address</span>
      {@render addressForm(newData.customerData!.billingAddress!)}
      <span class="label-text font-bold">Delivery Address</span>
      {@render addressForm(newData.customerData!.deliveryAddress!)}
      <SubmitButton/>
      {#if item?.id}
        <button class="btn bg-slate-600" onclick={deleteDraft}>Delete</button>
      {/if}
      <div class="label"></div>
    </FormWrapper>

    {#if item?.id}
      <BuyerCart
        show
        draft
        {store}
        {client}
        orderType={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        bind:cartCode={item.id}
      />
    {:else}
      <BuyerCart
        show
        draft
        {store}
        {client}
        orderType={OrderTypeEnum.SELLER_PURCHASE_ORDER}
      />
    {/if}
  </div>
</Modal>
