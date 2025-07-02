<script lang="ts">
  import { DeliveryTypeEnum, OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { getObjectDiff, isNil } from '@/lib/helper/util';
  import type { Cart, CartDraftUser, CartDraftUserAddress, CartParent } from '@/types/cart';
  import type { User, UserOffline } from '@/types/user';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import DatePicker from '../DatePicker.svelte';
  import Modal from '../Modal.svelte';
  import BuyerCart from './BuyerCart.svelte';
  import DocumentManagement from './DocumentManagement.svelte';
  import InventoryList from './InventoryList.svelte';
  import UserOfflineDropdownSelect from './UserOfflineDropdownSelect.svelte';
  import CompanyUserDropdownSelect from './CompanyUserDropdownSelect.svelte';
  import AreaDropdownSelect from './AreaDropdownSelect.svelte';

  type Props = {
    dialog: HTMLDialogElement | undefined,
    item?: CartParent,
    companyId?: string,
    onsuccess?: (data: CartParent) => void
    ondelete?: (data: CartParent) => void
  };
  let {
    dialog = $bindable(),
    item = $bindable(),
    companyId = $bindable(),
    onsuccess: onSuccessParent,
    ondelete,
  }: Props = $props();

  const { user } = Context;
  const { client, auth } = Context.strict;

  const defaultData = {
    customerId: '',
    salesId: '',
    refCode: '',
    creationDate: null,
    paymentTypeId: '',
    shippingCost: 0,
    tax: 0,
    deliveryType: DeliveryTypeEnum.SELLER_DELIVERY,
    customerData: {
      picName: '',
      email: '',
      phone: '+62',
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

  const oldData:Partial<CartParent> = $state({ ...defaultData });
  const newData:Partial<CartParent> = $state({ ...defaultData });

  let show = $state(false);
  let sameAddress = $state(false);

  async function getCartDraftDetail() {
    if (!item) return;
    stringToast('Loading cart draft detail...');
    const response = await client.get(`/cart/draft/${item.id}`);
    if (response.status !== 200) {
      return stringToast('Failed to load cart draft detail');
    }
    const data:Partial<CartParent> = response.data.data;
    data.companyId = companyId;
    if (!data.customerData) {
      data.customerData = defaultData.customerData;
    }
    Object.assign(newData, data);
    Object.assign(oldData, data);
    return stringToast('Cart draft detail loaded');
  }

  $effect(() => {
    if (item) {
      getCartDraftDetail();
    } else {
      Object.assign(newData, defaultData);
      delete newData.companyId;
      Object.assign(oldData, defaultData);
      delete oldData.companyId;
    }
  });

  $effect(() => {
    if (sameAddress) {
      newData.customerData!.deliveryAddress = { ...newData.customerData!.billingAddress };
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
    if (payload.email) {
      newPayload.email = payload.email;
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
    if (payload.paymentTypeId) {
      newPayload.paymentTypeId = payload.paymentTypeId;
    }
    if (payload.deliveryType) {
      newPayload.deliveryType = payload.deliveryType;
    }
    if (!isNil(payload.shippingCost)) {
      newPayload.shippingCost = payload.shippingCost;
    }
    if (!isNil(payload.tax)) {
      newPayload.tax = payload.tax;
    }
    if (payload.customerData) {
      newPayload.customerData = customerDataPrehook(payload.customerData);
    }
    return newPayload;
  }

  function prehook(payload: Partial<CartParent>): Partial<CartParent> {
    if (!item) return savePrehook(payload);
    const newPayload: Partial<CartParent> = getObjectDiff(payload, oldData);
    newPayload.customerData = payload.customerData;
    newPayload.companyId = companyId;
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
    Object.assign(newData, data);
    newData.companyId = companyId;
    Object.assign(oldData, data);
    oldData.companyId = companyId;
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

{#snippet addressForm(data: CartDraftUserAddress, disabled = false)}
  <FormInput {disabled} type="text" placeholder="address" label="Address" bind:value={data.address}/>
  <AreaDropdownSelect
    {disabled}
    {client}
    store={auth}
    bind:value={data.provinceId}
  />
  <AreaDropdownSelect
    {disabled}
    type="REGENCY"
    {client}
    store={auth}
    bind:parentId={data.provinceId}
    bind:value={data.regencyId}
  />
  <FormInput {disabled} type="text" placeholder="postal code" label="Postal Code" bind:value={data.postalCode}/>
{/snippet}

<Modal bind:dialog onopen={() => show = true}>
  <div class="flex flex-col items-start w-full min-h-full h-fit overflow-y-scroll">
    <FormWrapper
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
      <CompanyUserDropdownSelect
        bind:value={newData.salesId!}
        roleName={[
          'EXTERNAL_SALESMAN',
          'ADMIN',
          'SELLER_ADMIN',
        ]}
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
      {#if newData.orderCode}
        <FormInput readonly type="text" label="Order Code" bind:value={newData.orderCode}/>
      {/if}
      <FormInput type="text" placeholder="ref code" label="Ref Code" bind:value={newData.refCode}/>
      {#if newData.customerData}
        <FormInput type="text" placeholder="e-mail" label="E-Mail" bind:value={newData.customerData.email}/>
        <span class="fieldset-label font-bold mb-2">Billing Address</span>
        {@render addressForm(newData.customerData.billingAddress!)}
        <span class="fieldset-label font-bold mb-2">Delivery Address</span>
        <label class="label">
          <input type="checkbox" bind:checked={sameAddress} class="checkbox">
          Same Address
        </label>
        {@render addressForm(newData.customerData.deliveryAddress!, sameAddress)}
      {/if}
      <FormInput type="number" placeholder="shipping cost" label="Shipping Cost" bind:value={newData.shippingCost}/>
      <FormInput type="number" placeholder="tax" label="Tax" bind:value={newData.tax}/>
      <SubmitButton/>
      {#if item?.id}
        <button class="btn btn-secondary" onclick={deleteDraft}>Delete</button>
      {/if}
    </FormWrapper>

    {#if item?.id}
      <InventoryList
        order
        cartCode={item.id}
        bind:companyId
      />
      <div class="mb-2"></div>
      <BuyerCart
        bind:show
        draft
        ordertype={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        prehook={saveDraft}
        bind:cartCode={item.id}
        bind:companyId
        bind:paymentTypeId={newData.paymentTypeId!}
        bind:deliveryType={newData.deliveryType!}
      />
    {:else}
      <BuyerCart
        bind:show
        draft
        ordertype={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        {onordercreated}
        bind:companyId
        bind:paymentTypeId={newData.paymentTypeId!}
        bind:deliveryType={newData.deliveryType!}
      />
    {/if}
    {#if $user?.id}
      <div class="mb-2"></div>
      <DocumentManagement show bind:entityid={$user.id}/>
    {/if}
  </div>
</Modal>
