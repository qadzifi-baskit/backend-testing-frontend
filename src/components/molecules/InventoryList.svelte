<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import AddInventoryModal from '@/components/molecules/AddInventoryModal.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import type { Inventory } from '@/types/inventory';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Table5 from '../Table5.svelte';
  import ModifyInventoryModal from './ModifyInventoryModal.svelte';
  import type { HTMLInputEvent } from '@/types/event';
  import { stringToast } from '@/lib/helper/toast';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    grosir?: boolean,
    order?: boolean,
    userId?: string,
    cartCode?: string,
    companyId?: string,
    memberLevel?: string|null,
    show?: boolean,
  };
  let {
    client,
    store,
    grosir = false,
    order = false,
    cartCode,
    companyId = $bindable(),
    memberLevel = $bindable(null),
    show = $bindable(false),
  }:Props = $props();

  const prefix = grosir ? '' : '';
  const selectedMap:Record<string, Inventory> = $state({});

  let inventoryList:Inventory[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');
  let selectedInventoryId = $state('');
  let bulkSelect = $state(false);

  const getInventoryList = async () => {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
      $order: 'createdAt',
      $sort: 'ASC',
      noStockInBottom: 'true',
    });
    if (companyId && companyId !== '') {
      params.append('companyId', companyId);
    }
    const response = await client.get(
      `${prefix}/inventory`,
      {
        params,
      },
    );
    if (response.status === 200) {
      inventoryList = response.data?.data;
      max = response.data?.totalPage;
    }
  };

  const debounceGetInventory = debounce(getInventoryList);

  $effect(() => {
    search;
    page = 1;
  });

  $effect(() => {
    if (show && $store.loggedIn) {
      page;
      search;
      debounceGetInventory();
    }
  });

  let addInventoryDialog:HTMLDialogElement|undefined = $state();
  const showAddInventory = () => {
    addInventoryDialog?.showModal();
  };

  const qtyMap:Record<string, number> = $state({});
  function addItem(item: Inventory) {
    return async () => client.post(`${prefix}/cart`, {
      inventoryId: item.id,
      qty: qtyMap[item.id],
      userId: null,
      productId: item.productId,
      companyId: item.companyId,
      wareHouse: 0,
      memberLevel,
      cartCode,
    });
  }
  async function addItemBulk() {
    const payload = Object.values(selectedMap).map((item) => ({
      inventoryId: item.id,
      qty: 1,
      userId: null,
      productId: item.productId,
      companyId: item.companyId,
      wareHouse: 0,
      memberLevel,
      cartCode,
    }));
    const response = await client.post(`${prefix}/cart/bulk`, { data: payload });
    if (response.status !== 200) {
      return stringToast('Failed to add item');
    }
    for (const key in selectedMap) {
      delete selectedMap[key];
    }
    bulkSelect = false;
    return stringToast('Item added');
  }

  let modifyInventoryDialog:HTMLDialogElement|undefined = $state();
  function showModifyInventory(item: Inventory) {
    return () => {
      selectedInventoryId = item.id;
      modifyInventoryDialog?.showModal();
    };
  }

  function onselect(item: Inventory) {
    return (e: HTMLInputEvent) => {
      if (e.currentTarget.checked) {
        selectedMap[item.id] = item;
      } else {
        delete selectedMap[item.id];
      }
    };
  }
</script>

<AddInventoryModal
  bind:dialog={addInventoryDialog}
  {client}
/>
<ModifyInventoryModal
  bind:dialog={modifyInventoryDialog}
  {client}
  bind:inventoryId={selectedInventoryId}
  onupdate={getInventoryList}
  isGrosir={grosir}
/>
<Collapse title="Inventory"
  class="w-full"
  onclick={getInventoryList}
  bind:show
>
  <PaginationNavigationPanel
    bind:max
    bind:search
    bind:page
    onreload={getInventoryList}
    onadd={showAddInventory}
  />
  <DropdownSelect
    bind:value={memberLevel}
    display="LABEL"
    placeholder="None"
    options={[
      [null, 'None'],
      ['SILVER', 'Silver'],
      ['GOLD', 'Gold'],
      ['PLATINUM', 'Platinum'],
    ]}
  />
  {#if order}
    <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64">
      <legend class="fieldset-legend">Bulk</legend>
      <label class="fieldset-label">
        <input type="checkbox" bind:checked={bulkSelect} class="toggle" />
      </label>
    </fieldset>
    <button onclick={addItemBulk} disabled={!bulkSelect || Object.keys(selectedMap).length <= 0} class="btn not-hover:bg-slate-600">Add Bulk</button>
  {/if}
  {#if inventoryList.length > 0}
    <Table5
      itemList={inventoryList}
    >
      {#snippet header()}
        {#if bulkSelect}
          <th></th>
        {/if}
        <th>Stock</th>
        <th>Status</th>
        <th>Base Price</th>
        <th>Customer Price</th>
        {#if order}
          <th>Qty</th>
          <th></th>
        {:else}
          <th></th>
        {/if}
        <th>Name</th>
      {/snippet}

      {#snippet content(item: Inventory)}
        {#if bulkSelect}
          <th>
            <input type="checkbox" class="checkbox"
              onchange={onselect(item)}
            />
          </th>
        {/if}
        <td>{item.stock}</td>
        <td>{item.isActive}</td>
        <td>{item.sellingPrice}</td>
        <td>{item.customerPrice}</td>
        {#if order}
          <td>
            <input type="number" placeholder="qty" class="input input-bordered w-24 max-w-xs"
              bind:value={qtyMap[item.id]}
            />
          </td>
          <td>
            <button class="btn btn-secondary"
              onclick={addItem(item)}
            >
              Add
            </button>
          </td>
        {:else}
          <td>
            <button class="btn btn-secondary"
              onclick={showModifyInventory(item)}
            >
              <Icon src={FaSolidPencil}/>
            </button>
          </td>
        {/if}
        <td>{item.fullName}</td>
      {/snippet}
    </Table5>
  {/if}
</Collapse>
