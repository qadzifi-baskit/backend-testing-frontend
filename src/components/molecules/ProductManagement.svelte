<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import type { ProductMaster } from '@/types';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import Table from '../Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import AddProductModal from './AddProductModal.svelte';

  export let client:AxiosInstance;

  let page = 1;
  let max = 1;
  let productList:ProductMaster[] = [];
  let search = '';

  const getProductList = async () => {
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('$page', `${page}`);
    const response = await client.get(
      '/product/master',
      {
        params,
      },
    );
    if (response.status === 200) {
      productList = response.data?.data ?? [];
    }
  };

  const debounceGetProduct = debounce(getProductList);

  $: {
    search;
    page = 1;
  }

  $: {
    page;
    search;
    debounceGetProduct();
  }

  let addProductDialog:HTMLDialogElement|undefined;
  const onShowAddProduct = () => {
    addProductDialog?.showModal();
  };
</script>

<AddProductModal
  bind:dialog={addProductDialog}
  {client}
/>
<Collapse title="Product"
  class="w-full"
  onClick={getProductList}
>
  <label class="input input-bordered flex items-center gap-2 mb-12">
    <input type="text" class="grow" placeholder="Search" bind:value={search}/>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="h-4 w-4 opacity-70">
      <path
        fill-rule="evenodd"
        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        clip-rule="evenodd" />
    </svg>
  </label>
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  <button class="btn bordered input-bordered"
    on:click={onShowAddProduct}
  >
    Add Product
  </button>
  {#if productList.length > 0}
    <Table itemList={productList}/>
  {/if}
</Collapse>
