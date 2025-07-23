<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce } from '@/lib/helper/util';
  import type { ProductMaster } from '@/types';
  import type { AddInventoryOptions } from '@/types/inventory';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidCheck, FaSolidPlus } from 'svelte-icons-pack/fa';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import AddInventoryModal from './AddInventoryModal.svelte';
  import AddProductModal from './AddProductModal.svelte';

  type Props = {
    companyId?: string,
    addOptions?: AddInventoryOptions,
    show?: boolean,
  };
  let {
    companyId = $bindable(),
    addOptions = {},
    show = $bindable(false),
  }:Props = $props();
  const {
    moq = 1,
    tierAmount = 4,
  } = addOptions;

  const { auth, client } = Context.strict;

  let page = $state(1);
  let max = $state(1);
  let productList:ProductMaster[] = $state([]);
  let search = $state('');
  let productId = $state('');

  const getProductList = async () => {
    if (!$auth.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (companyId && companyId !== '') {
      params.append('companyId', companyId);
      params.append('ownership', companyId);
    }
    const response = await client.get(
      '/inventory_2',
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
    if (show && $auth.loggedIn) {
      page;
      search;
      debounceGetProduct();
    }
  });

  let addProductDialog:HTMLDialogElement|undefined = $state();
  function showAddProduct() {
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
  <th></th>
  <th>Name</th>
  <th>SKU</th>
  <th>Full Name</th>
{/snippet}

{#snippet content(item: ProductMaster)}
  <td><NoWrap>{item.id}</NoWrap></td>
  <td>
    <button class="btn btn-secondary" disabled={item.isAdded}
      onclick={onShowAddInventory(item.id)}
    >
      {#if item.isAdded}
        <Icon src={FaSolidCheck}/>
      {:else}
        <Icon src={FaSolidPlus}/>
      {/if}
    </button>
  </td>
  <td><NoWrap>{item.name}</NoWrap></td>
  <td><NoWrap>{item.sku}</NoWrap></td>
  <td><NoWrap>{item.fullName}</NoWrap></td>
{/snippet}

<AddProductModal
  bind:dialog={addProductDialog}
  {client}
  {companyId}
/>
<AddInventoryModal
  bind:dialog={addInventoryDialog}
  addOptions={{
    moq,
    tierAmount,
  }}
  {productId}
  {companyId}
  {client}
/>
<Collapse title="Product"
  class="w-full"
  onclick={getProductList}
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onreload={getProductList}
    onadd={showAddProduct}
  />
  {#if productList.length > 0}
    <Table5 itemList={productList}
      {header}
      {content}
    />
  {/if}
</Collapse>
