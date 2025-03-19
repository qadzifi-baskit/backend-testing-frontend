<script lang="ts">
  import { OrderTypeEnum } from '@/lib/enum';
  import { SellerAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { CartParent } from '@/types/cart';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import Modal from '../Modal.svelte';
  import BuyerCart from './BuyerCart.svelte';
  import { stringToast } from '@/lib/helper/toast';

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
    id: '',
    salesId: '',
  });

  $effect(() => {
    if (item) {
      newData.id = item.id;
      newData.salesId = item.salesId;
    } else {
      newData.id = '';
      newData.salesId = '';
    }
  });

  function prehook(payload: Partial<CartParent>): Partial<CartParent> {
    if (!item) return {
      ...payload,
      companyId,
    };
    const newPayload: Partial<CartParent> = {
      companyId,
    };
    if (payload.id !== item.id) {
      newPayload.id = payload.id;
    }
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

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <FormWrapper
      {client}
      path={`/cart/draft/${item?.id ?? ''}`}
      method="PATCH"
      payload={newData}
      {onsuccess}
      {prehook}
    >
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Id</span>
        </div>
        <input readonly type="text" placeholder="id" bind:value={newData.id} class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs mb-2">
        <div class="label">
          <span class="label-text">Sales Id</span>
        </div>
        <input type="text" placeholder="sales id" bind:value={newData.salesId} class="input input-bordered w-full max-w-xs" />
      </label>
      <SubmitButton/>
      <button class="btn bg-slate-600 my-2" onclick={deleteDraft}>Delete</button>
    </FormWrapper>

    {#if item?.id}
      <BuyerCart
        show
        {store}
        {client}
        orderType={OrderTypeEnum.SELLER_PURCHASE_ORDER}
        bind:cartCode={item.id}
      />
    {/if}
  </div>
</Modal>
