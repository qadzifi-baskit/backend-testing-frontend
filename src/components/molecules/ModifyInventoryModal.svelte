<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import { isNil } from '@/lib/helper/util';
  import PriceTierManagement from './PriceTierManagement.svelte';
  import MemberDiscountManagement from './MemberDiscountManagement.svelte';
  import type { Inventory, MemberDiscount, PriceTier } from '@/types/inventory';

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
    priceTier: <PriceTier[]>[],
    sellerPriceTier: <PriceTier[]>[],
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
    data.priceTier = inventory.priceTier;
    data.sellerPriceTier = inventory.sellerPriceTier;
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
    if (onupdate) {
      onupdate();
    }
  }

  async function savePriceTier(payload: PriceTier[]) {
    const response = await client.patch(
      `/price-tier/inventory/${inventoryId}`,
      {
        priceTiers: payload.map((tier) => ({
          ...tier,
          id: undefined,
        })),
      },
    );
    if (response.status !== 200) return;
    afterUpdate();
  }

  async function saveSellerPriceTier(payload: PriceTier[]) {
    const response = await client.patch(
      `/price-tier/inventory/${inventoryId}`,
      {
        sellerPriceTiers: payload.map((tier) => ({
          ...tier,
          id: undefined,
        })),
      },
    );
    if (response.status !== 200) return;
    afterUpdate();
  }

  async function saveMemberDiscount(payload: MemberDiscount[]) {
    const response = await client.patch(
      `/inventory/${inventoryId}`,
      {
        memberDiscount: payload,
      },
    );
    if (response.status !== 200) return;
    afterUpdate();
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
      class="btn bg-slate-600 mt-2"
    >
      Save
    </button>
    <PriceTierManagement
      onsave={savePriceTier}
      bind:tierList={data.priceTier}
    />
    <PriceTierManagement
      onsave={saveSellerPriceTier}
      bind:tierList={data.sellerPriceTier}
      tierMin={0}
      buttonSnippet="Save Seller Price Tier"
    />
    <MemberDiscountManagement
      onsave={saveMemberDiscount}
      {inventoryId}
      bind:discountList={data.memberDiscount}
    />
  </div>
</Modal>
