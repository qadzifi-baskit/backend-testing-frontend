<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';

  export let client:AxiosInstance;
  export let dialog:HTMLDialogElement|undefined;

  const addInventoryData = {
    stock: 0,
    basePrice: 0,
    sellingPrice: 0,
    margin: 0,
    companyId: '',
    productId: '',
    generateTier: false,
  };

  const onAddInventory = async () => {
    const response = await client.post(
      '/inventory',
      addInventoryData,
    );
    if (response.status === 200) {
      dialog?.close();
    }
  };
</script>

<Modal
  bind:dialog
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Stock</span>
      </div>
      <input type="number" placeholder="stock" bind:value={addInventoryData.stock} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Base Price</span>
      </div>
      <input type="number" placeholder="basePrice" bind:value={addInventoryData.basePrice} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Selling Price</span>
      </div>
      <input type="number" placeholder="sellingPrice" bind:value={addInventoryData.sellingPrice} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Margin</span>
      </div>
      <input type="number" placeholder="margin" bind:value={addInventoryData.margin} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Company ID</span>
      </div>
      <input type="text" placeholder="companyId" bind:value={addInventoryData.companyId} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Product ID</span>
      </div>
      <input type="text" placeholder="productId" bind:value={addInventoryData.productId} class="input input-bordered w-full max-w-xs" />
    </label>
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Generate Tier</span>
        <input type="checkbox" class="toggle" bind:checked={addInventoryData.generateTier}/>
      </label>
    </div>
    <button
      on:click={onAddInventory}
      class="btn bg-slate-600"
    >
      Add
    </button>
  </div>
</Modal>
