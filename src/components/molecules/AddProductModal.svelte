<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import type { Brand, Principal } from '@/types';
  import type { Category } from '@/types/category';
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import SubmitButton from '../atoms/SubmitButton.svelte';
  import BrandDropdownSelect from './BrandDropdownSelect.svelte';
  import UomDropdownSelect from './UOMDropdownSelect.svelte';
  import FormInput from '../atoms/FormInput.svelte';

  type Props = {
    client: AxiosInstance,
    dialog?: HTMLDialogElement,
    sku?: boolean,
    companyId?: string,
  };
  let {
    client,
    dialog = $bindable(),
    sku,
    companyId = $bindable(),
  }: Props = $props();

  const productData = $state({
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

  const inventoryData = $state({
    stock: 0,
    basePrice: 0,
    sellingPrice: 0,
    customerPrice: 0,
    margin: 0,
    companyId,
  });

  const addToInventoryData = $derived({ productData, inventoryData });

  let categoryList:Category[] = $state([]);
  let selectedBrand = $state<Brand>();
  let principalList:Principal[] = $state([]);
  let addToInventory = $state(false);

  async function getCategoryList() {
    const response = await client.get('/category', {
      params: {
        type: 'CATEGORY',
      },
    });
    if (response.status !== 200) {
      return stringToast('Failed to load category');
    }
    categoryList = response.data?.data ?? [];
  }

  async function onopen() {
    await getCategoryList();
  }

  async function onsuccess() {
    dialog?.close();
  };

  function onSelectBrand(value?: Brand) {
    selectedBrand = value;
  }

  async function getPrincipalFromBrand(brandId: string) {
    if (!selectedBrand) {
      return stringToast('Brand not selected');
    }
    const response = await client.get('/principal', {
      params: {
        brandId,
      },
    });
    if (response.status !== 200) {
      return stringToast('Failed to load brand');
    }
    principalList = response.data?.data ?? [];
    if (principalList.length > 0) {
      productData.principal = principalList[0].name;
    }
  }

  $effect(() => {
    if (selectedBrand) {
      productData.brand = selectedBrand.name;
      getPrincipalFromBrand(selectedBrand.id);
    } else {
      productData.brand = '';
      productData.principal = '';
    }
  });
</script>

<Modal
  bind:dialog
  {onopen}
>
  <div
    class="flex flex-col items-start w-full h-full"
  >
    <FormWrapper
      path={!addToInventory ? '/product/master' : '/product/inventory'}
      {client}
      payload={!addToInventory ? productData : addToInventoryData}
      params={new URLSearchParams({ type: 'PUBLIC' })}
      {onsuccess}
      class="*:mb-2"
    >
      <span class="fieldset-label">Name</span>
      <input type="text" placeholder="name" bind:value={productData.name} class="input input-bordered w-full max-w-xs" />
      <span class="fieldset-label">Variant</span>
      <input type="text" placeholder="variant" bind:value={productData.variant} class="input input-bordered w-full max-w-xs" />
      <span class="fieldset-label">Size</span>
      <input type="number" placeholder="size" bind:value={productData.size} class="input input-bordered w-full max-w-xs" />
      <span class="fieldset-label">Pack Type</span>
      <select class="select" bind:value={productData.packType}>
        <option disabled selected>Pick pack type</option>
        <option value="CARTON">Carton</option>
        <option value="DUS">Dus</option>
        <option value="GRAM">Gram</option>
        <option value="PACK">Gram</option>
        <option value="RENCENG">Renceng</option>
      </select>
      <span class="fieldset-label">Category</span>
      <DropdownSelect
        placeholder="category"
        display="LABEL"
        options={categoryList.map((item) => [item.id, item.name])}
        bind:value={productData.categoryId}
      />
      <BrandDropdownSelect bind:value={productData.brand} onselect={onSelectBrand}/>
      <span class="fieldset-label">Principal</span>
      <input readonly type="text" placeholder="principal" bind:value={productData.principal} class="input input-bordered w-full max-w-xs" />
      <UomDropdownSelect {client} bind:value={productData.uomId}/>
      {#if sku}
        <span class="fieldset-label">SKU</span>
        <input type="text" placeholder="sku" bind:value={productData.sku} class="input input-bordered w-full max-w-xs" />
      {/if}
      <label class="fieldset-label">
        <input type="checkbox" class="toggle" bind:checked={addToInventory}>
        Add to Inventory
      </label>
      {#if addToInventory}
        <FormInput type="number" label="Stock" bind:value={inventoryData.stock}/>
        <FormInput type="number" label="Price" bind:value={inventoryData.customerPrice}/>
      {/if}
      <SubmitButton/>
    </FormWrapper>
  </div>
</Modal>
