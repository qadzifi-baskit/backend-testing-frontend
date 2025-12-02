<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import Modal from '../Modal.svelte';
  import ProductCategoryDropdownSelect from './ProductCategoryDropdownSelect.svelte';

  type Props = {
    dialog: HTMLDialogElement | undefined,
    companyId: string,
  };
  let {
    dialog = $bindable(),
    companyId = $bindable(),
  }: Props = $props();

  const { client } = Context.strict;

  const addInventoryData = $state({
    companyId,
    draft: true,
    brandName: '',
    principalName: '',
    name: '',
    typeId: '',
    smallestUnit: '',
    images: [{ name: '' }],
  });

  $effect(() => {
    addInventoryData.companyId = companyId;
  });

  const onAddInventory = async () => {
    const response = await client.post(
      '/inventory-2',
      {
        ...addInventoryData,
        companyId,
      },
    );
    if (response.status === 200) {
      dialog?.close();
    }
  };
</script>

<Modal bind:dialog>
  <div class="flex flex-col items-start w-full h-full">
    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Brand Name</span></div>
      <input type="text" placeholder="brand name" bind:value={addInventoryData.brandName} class="input input-bordered w-full max-w-xs" />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Principal Name</span></div>
      <input type="text" placeholder="principal name" bind:value={addInventoryData.principalName} class="input input-bordered w-full max-w-xs" />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Name</span></div>
      <input type="text" placeholder="name" bind:value={addInventoryData.name} class="input input-bordered w-full max-w-xs" />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <ProductCategoryDropdownSelect label="Type" parentname="Product Type"
        bind:value={addInventoryData.typeId}
      />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Smallest Unit</span></div>
      <input type="text" placeholder="smallest unit" bind:value={addInventoryData.smallestUnit} class="input input-bordered w-full max-w-xs" />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Image Name</span></div>
      <input type="text" placeholder="image filename" bind:value={addInventoryData.images[0].name} class="input input-bordered w-full max-w-xs" />
    </label>

    <label class="form-control w-full max-w-xs mb-2">
      <div class="label"><span class="label-text">Company ID</span></div>
      <input type="text" placeholder="company id" bind:value={addInventoryData.companyId} class="input input-bordered w-full max-w-xs" disabled={companyId !== ''} />
    </label>

    <div class="form-control mb-4">
      <label class="label cursor-pointer">
        <span class="label-text mr-4 self-baseline">Draft</span>
        <input type="checkbox" class="toggle" bind:checked={addInventoryData.draft}/>
      </label>
    </div>

    <button onclick={onAddInventory} class="btn btn-secondary">Add</button>
  </div>
</Modal>

