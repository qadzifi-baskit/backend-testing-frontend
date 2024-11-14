<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore, ProductMaster } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidCheck, FaSolidPlus } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import AddProductModal from './AddProductModal.svelte';
  import AddInventoryModal from './AddInventoryModal.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    companyId?: string,
  };
  let {
    client,
    store,
    companyId = $bindable(),
  }:Props = $props();

  let page = $state(1);
  let max = $state(1);
  let productList:ProductMaster[] = $state([]);
  let search = $state('');
  let productId = $state('');

  const getProductList = async () => {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (companyId && companyId !== '') {
      params.append('companyId', companyId);
      params.append('ownership', companyId);
    }
    const response = await client.get(
      '/product/master',
      {
        params,
      },
    );
    if (response.status === 200) {
      productList = response.data?.data ?? [];
      max = response.data?.totalPage ?? 1;
    }
  };

  const debounceGetProduct = debounce(getProductList);

  $effect(() => {
    search;
    page = 1;
  });

  $effect(() => {
    if ($store.loggedIn) {
      page;
      search;
      debounceGetProduct();
    }
  });

  let addProductDialog:HTMLDialogElement|undefined = $state();
  function onShowAddProduct() {
    addProductDialog?.showModal();
  };

  let addInventoryDialog:HTMLDialogElement|undefined = $state();
  function onShowAddInventory(id: string) {
    return () => {
      productId = id;
      addInventoryDialog?.showModal();
    };
  };

  $effect(() => {
    if (addInventoryDialog) {
      addInventoryDialog.onclose = () => {
        getProductList();
      };
    }
  });
</script>

{#snippet header()}
  <th>Id</th>
  <th>Name</th>
  <th>SKU</th>
  <th></th>
{/snippet}

{#snippet content(item: ProductMaster)}
  <td>{item.id}</td>
  <td>{item.name}</td>
  <td>{item.sku}</td>
  <td>
    <button class="btn bg-slate-600" disabled={item.isAdded}
      onclick={onShowAddInventory(item.id)}
    >
      {#if item.isAdded}
        <Icon src={FaSolidCheck}/>
      {:else}
        <Icon src={FaSolidPlus}/>
      {/if}
    </button>
  </td>
{/snippet}

<AddProductModal
  bind:dialog={addProductDialog}
  {client}
/>
<AddInventoryModal
  bind:dialog={addInventoryDialog}
  {productId}
  {companyId}
  {client}
/>
<Collapse title="Product"
  class="w-full"
  onClick={getProductList}
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
  />
  <button class="btn bordered input-bordered"
    onclick={onShowAddProduct}
  >
    Add Product
  </button>
  {#if productList.length > 0}
    <Table5 itemList={productList}
      {header}
      {content}
    />
  {/if}
</Collapse>
