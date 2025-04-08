<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    dialog = $bindable(),
  }: Props = $props();

  const addProductData = $state({
    name: '',
    variant: '',
    size: 0,
    packType: '',
    categoryId: '',
    brand: '',
    principal: '',
    uomId: '',
    sku: '',
  });

  const addProduct = async () => {
    const params = new URLSearchParams();
    params.append('type', 'PUBLIC');
    const response = await client.post(
      '/product/master',
      addProductData,
      {
        params,
      },
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
        <span class="label-text">Name</span>
      </div>
      <input type="text" placeholder="name" bind:value={addProductData.name} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Variant</span>
      </div>
      <input type="text" placeholder="variant" bind:value={addProductData.variant} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Size</span>
      </div>
      <input type="number" placeholder="size" bind:value={addProductData.size} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Pack Type</span>
      </div>
      <input type="text" placeholder="packType" bind:value={addProductData.packType} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Category ID</span>
      </div>
      <input type="text" placeholder="categoryId" bind:value={addProductData.categoryId} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Brand</span>
      </div>
      <input type="text" placeholder="brand" bind:value={addProductData.brand} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">Principal</span>
      </div>
      <input type="text" placeholder="principal" bind:value={addProductData.principal} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">UOM ID</span>
      </div>
      <input type="text" placeholder="uomId" bind:value={addProductData.uomId} class="input input-bordered w-full max-w-xs" />
    </label>
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label">
        <span class="label-text">SKU</span>
      </div>
      <input type="text" placeholder="sku" bind:value={addProductData.sku} class="input input-bordered w-full max-w-xs" />
    </label>
    <button
      onclick={addProduct}
      class="btn btn-secondary"
    >
      Add
    </button>
  </div>
</Modal>
