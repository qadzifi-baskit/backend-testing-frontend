<script lang="ts">
  import { OrderTypeEnum } from '@/lib/enum';
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import type { InventoryVariant } from '@/types/inventory';
  import type { PaginationOrder } from '@/types/pagination';
  import { untrack } from 'svelte';
  import AddButton from '../atoms/AddButton.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddInventory2Modal from './AddInventory2Modal.svelte';
  import FormInput from '../atoms/FormInput.svelte';

  type Props = {
    companyId?: string,
    show?: boolean,
    isorder?: boolean,
    cartCode?: string,
  };
  let {
    companyId = $bindable(),
    show = $bindable(false),
    isorder = $bindable(false),
    cartCode,
  }:Props = $props();

  const { auth, client } = Context.strict;
  const payloadMap:Record<string, { qty: number, unitId: string }> = $state({});

  let page = $state(1);
  let max = $state(1);
  let limit = $state(10);
  let productList:InventoryVariant[] = $state([]);
  let search = $state('');
  let sort:string|null = $state(null);
  let order:PaginationOrder = $state('ASC');
  let draft:string|null = $state(null);
  let active:string|null = $state(null);
  let isLow:string|null = $state(null);
  let orderId = $state('');

  async function reloadData() {
    if (!$auth.loggedIn) return stringToast('Not logged in');
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
    if (isLow) {
      params.append('isLow', isLow);
    }
    if (orderId) {
      params.append('orderId', orderId);
    }
    stringToast('Loading data...');
    const response = await client.get(
      '/inventory-2/variant',
      {
        params,
      },
    );
    if (response.status !== 200) return stringToast('Failed to load data');
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
    stringToast('Data loaded');
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
      isLow;
      orderId;
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
      isLow;
      orderId;
      untrack(debounceGetProduct);
    }
  });

  let addInventoryDialog:HTMLDialogElement|undefined = $state();

  $effect(() => {
    if (addInventoryDialog) {
      addInventoryDialog.onclose = () => {
        reloadData();
      };
    }
  });

  let dropDialog = $state<HTMLDialogElement>();
</script>

{#if companyId}
  <AddInventory2Modal
    bind:dialog={addInventoryDialog}
    {companyId}
  />
{/if}
<Collapse5 title="Inventory 2"
  class="w-full"
  bind:show
>
  <FormInput label="Order Id" bind:value={orderId}/>
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
    onadd={() => addInventoryDialog?.showModal()}
  />
  <div class="inline-block">
    <span class="fieldset-label mb-2 capitalize">Active</span>
    <DropdownSelect
      placeholder="ALL"
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
      placeholder="ALL"
      options={[
        [null, 'ALL'],
        ['true', 'True'],
        ['false', 'False'],
      ]}
      bind:value={draft}
    />
  </div>
  <div class="inline-block">
    <span class="fieldset-label mb-2 capitalize">Is Low</span>
    <DropdownSelect
      placeholder="ALL"
      options={[
        [null, 'ALL'],
        ['true', 'True'],
        ['false', 'False'],
      ]}
      bind:value={isLow}
    />
  </div>
  <div class="inline-block">
    <button
      class="btn btn-primary btn-sm"
      onclick={() => {
        if (dropDialog?.open) {
          dropDialog.close();
        } else {
          dropDialog?.showModal();
        }
      }}
    >
      Drop
    </button>
    <dialog bind:this={dropDialog}>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
    </dialog>
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
