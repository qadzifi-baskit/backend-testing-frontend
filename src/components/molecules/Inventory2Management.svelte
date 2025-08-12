<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce } from '@/lib/helper/util';
  import type { AddInventoryOptions, InventoryVariant } from '@/types/inventory';
  import type { PaginationOrder } from '@/types/pagination';
  import { untrack } from 'svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddInventoryModal from './AddInventoryModal.svelte';
  import AddProductModal from './AddProductModal.svelte';
  import AddButton from '../atoms/AddButton.svelte';
  import { stringToast } from '@/lib/helper/toast';
  import { OrderTypeEnum } from '@/lib/enum';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    companyId?: string,
    addOptions?: AddInventoryOptions,
    show?: boolean,
    isorder?: boolean,
    cartCode?: string,
  };
  let {
    companyId = $bindable(),
    addOptions = {},
    show = $bindable(false),
    isorder = $bindable(false),
    cartCode,
  }:Props = $props();
  const {
    moq = 1,
    tierAmount = 4,
  } = addOptions;

  const { auth, client } = Context.strict;
  const payloadMap:Record<string, { qty: number, unitId: string }> = $state({});

  let page = $state(1);
  let max = $state(1);
  let limit = $state(10);
  let productList:InventoryVariant[] = $state([]);
  let search = $state('');
  let productId = $state('');
  let sort:string|null = $state(null);
  let order:PaginationOrder = $state('ASC');
  let draft:string|null = $state(null);
  let active:string|null = $state(null);

  async function reloadData() {
    if (!$auth.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
      $limit: `${limit}`,
    });
    if (sort !== null) {
      params.append('$order', sort);
      params.append('$sort', order);
    }
    if (companyId && companyId !== '') {
      params.append('companyId', companyId);
    }
    if (active) {
      params.append('active', active);
    }
    if (draft) {
      params.append('draft', draft);
    }
    const response = await client.get(
      '/inventory-2/variant',
      {
        params,
      },
    );
    if (response.status === 200) {
      productList = response.data?.data ?? [];
      max = response.data?.totalPage ?? 1;
      for (const key in payloadMap) {
        delete payloadMap[key];
      }
      productList.forEach((item) => {
        payloadMap[item.id] = {
          qty: 1,
          unitId: item.stockCount?.[0]?.unitId ?? '',
        };
      });
    }
  };

  function addItem(item: InventoryVariant) {
    return async () => {
      stringToast('Adding item...');
      const { ...payload } = payloadMap[item.id];
      const response = await client.post('/cart', {
        ...payload,
        orderType: OrderTypeEnum.BSC_SELLER_SALES_ORDER,
        inventoryId: item.id,
        userId: $auth.userId,
        // userId: null,
        companyId,
        wareHouse: 0,
        cartCode,
      });
      if (response.status !== 200) {
        return stringToast('Failed to add item');
      }
      stringToast('Item added');
      return response;
    };
  }

  const debounceGetProduct = debounce(reloadData);

  $effect(() => {
    if (show) {
      search;
      limit;
      active;
      draft;
      page = 1;
    }
  });

  $effect(() => {
    if (show && $auth.loggedIn) {
      page;
      search;
      limit;
      sort;
      order;
      active;
      draft;
      untrack(debounceGetProduct);
    }
  });

  let addProductDialog:HTMLDialogElement|undefined = $state();
  function showAddProduct() {
    addProductDialog?.showModal();
  };

  let addInventoryDialog:HTMLDialogElement|undefined = $state();

  $effect(() => {
    if (addInventoryDialog) {
      addInventoryDialog.onclose = () => {
        reloadData();
      };
    }
  });
</script>

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
<Collapse5 title="Inventory 2"
  class="w-full"
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    bind:limit
    bind:sort
    bind:order
    sortOptions={[
      ['stockQty', 'Stock'],
      ['createdAt', 'Created At'],
    ]}
    orderOptions={[
      ['ASC', 'Ascending'],
      ['DESC', 'Descending'],
      ['ASC,ASC', 'Ascending, Ascending'],
      ['ASC,DESC', 'Ascending, Descending'],
      ['DESC,ASC', 'Descending, Ascending'],
      ['DESC,DESC', 'Descending, Descending'],
    ]}
    onreload={reloadData}
    onadd={showAddProduct}
  />
  <div class="inline-block">
    <span class="fieldset-label mb-2 capitalize">Active</span>
    <DropdownSelect
      options={[
        [null, 'ALL'],
        ['true', 'True'],
        ['false', 'False'],
      ]}
      bind:value={active}
    />
  </div>
  <div class="inline-block">
    <span class="fieldset-label mb-2 capitalize">Draft</span>
    <DropdownSelect
      options={[
        [null, 'ALL'],
        ['true', 'True'],
        ['false', 'False'],
      ]}
      bind:value={draft}
    />
  </div>
  {#if productList.length > 0}
    <Table5 itemList={productList}>
      {#snippet header()}
        <th>Id</th>
        <th>Stock</th>
        {#if isorder}
          <th></th>
          <th>Unit</th>
          <th></th>
        {/if}
        <th>Name</th>
      {/snippet}

      {#snippet content(item: InventoryVariant)}
        {@const unitOptions = item.stockCount.map((unit): [string, string] => [unit.unitId, unit.unit])}
        {@const defaultValue = unitOptions?.[0]?.[0]}
        <td><NoWrap>{item.id}</NoWrap></td>
        <td><NoWrap>{item.stockQty}</NoWrap></td>
        {#if isorder}
          <td>
            <input type="number" placeholder="qty" class="input input-bordered w-24 max-w-xs"
              bind:value={payloadMap[item.id].qty}
            />
          </td>
          <td>
            <DropdownSelect
              display="LABEL"
              options={unitOptions}
              bind:value={payloadMap[item.id].unitId}
              default={defaultValue}
            />
          </td>
          <td><AddButton onclick={addItem(item)}/></td>
        {/if}
        <td><NoWrap>{item.name}</NoWrap></td>
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
