<script lang="ts">
  import { isNil } from '@/lib/helper/util';
  import type { Inventory, MemberDiscount } from '@/types/inventory';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';

  type Props = {
    client: AxiosInstance;
    inventoryId: string;
    dialog: HTMLDialogElement | undefined;
    onupdate?: () => unknown,
    isGrosir?: boolean,
  };
  let {
    client,
    inventoryId = $bindable(''),
    dialog = $bindable(),
    onupdate,
  }: Props = $props();

  const data = $state({
    stock: 0,
    basePrice: 0,
    customerPrice: 0,
    memberDiscount: <MemberDiscount[]>[],
  });

  async function getInventoryData() {
    if (inventoryId === '') return;
    const response = await client.get(
      `/inventory/${inventoryId}`,
    );
    if (response.status !== 200) return;
    if (isNil(response.data?.data)) return;
    const inventory:Inventory = response.data.data;
    data.stock = inventory.stock;
    data.basePrice = inventory.basePrice;
    data.memberDiscount = inventory.memberDiscount;
  }

  $effect(() => {
    getInventoryData();
  });

  async function modifyInventory() {
    const response = await client.patch(
      `/inventory/${inventoryId}`,
      data,
    );
    if (response.status !== 200) return;
    getInventoryData();
  }

  async function afterUpdate() {
    onupdate?.();
  }


  function onclose() {
    inventoryId = '';
  }
</script>

<Modal
  bind:dialog
  {onclose}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Stock</span>
      </div>
      <input type="number" placeholder="stock" bind:value={data.stock} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Base Price</span>
      </div>
      <input type="number" placeholder="basePrice" bind:value={data.basePrice} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Customer Price</span>
      </div>
      <input type="number" placeholder="basePrice" bind:value={data.customerPrice} class="input input-bordered w-full max-w-xs" />
    </label>
    <button
      onclick={modifyInventory}
      class="btn btn-secondary mt-2"
    >
      Save
    </button>
  </div>
</Modal>
