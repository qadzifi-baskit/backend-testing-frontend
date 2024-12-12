<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import AddInventoryModal from '@/components/molecules/AddInventoryModal.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore, Inventory } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Table5 from '../Table5.svelte';
  import ModifyInventoryModal from './ModifyInventoryModal.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    isGrosir?: boolean,
    isOrder?: boolean,
    userId?: string,
    companyId?: string,
    memberLevel?: string|null,
  };
  let {
    client,
    store,
    isGrosir = false,
    isOrder = false,
    userId = $bindable(),
    companyId = $bindable(),
    memberLevel = $bindable(null),
  }:Props = $props();

  const prefix = isGrosir ? '' : '';

  let inventoryList:Inventory[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');
  let selectedInventoryId = $state('');

  const getInventoryList = async () => {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
      $order: 'createdAt',
      $sort: 'ASC',
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
    if ($store.loggedIn) {
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
  function changeQtyHandler(id: string) {
    return (e: MouseEvent) => {
      if (e.currentTarget) {
        const input = e.currentTarget as HTMLInputElement;
        qtyMap[id] = Number(input.value);
      }
    };
  }
  function addItem(item: Inventory) {
    return async () => client.post(`${prefix}/cart`, {
      inventoryId: item.id,
      qty: qtyMap[item.id],
      userId,
      productId: item.productId,
      companyId: item.companyId,
      wareHouse: 0,
      memberLevel,
    });
  }

  let modifyInventoryDialog:HTMLDialogElement|undefined = $state();
  function showModifyInventory(item: Inventory) {
    return () => {
      selectedInventoryId = item.id;
      modifyInventoryDialog?.showModal();
    };
  }
</script>

{#snippet header()}
  <th>Stock</th>
  <th>Status</th>
  <th>Price</th>
  {#if isOrder}
    <th>Qty</th>
    <th></th>
  {:else}
    <th></th>
  {/if}
  <th>Name</th>
{/snippet}

{#snippet content(item: Inventory)}
  <td>{item.stock}</td>
  <td>{item.isActive}</td>
  <td>{item.sellingPrice}</td>
  {#if isOrder}
    <td>
      <input type="number" placeholder="qty" class="input input-bordered w-24 max-w-xs"
        onclick={changeQtyHandler(item.id)}
      />
    </td>
    <td>
      <button class="btn bg-slate-600"
        onclick={addItem(item)}
      >
        Add
      </button>
    </td>
  {:else}
    <td>
      <button class="btn bg-slate-600"
        onclick={showModifyInventory(item)}
      >
        <Icon src={FaSolidPencil}/>
      </button>
    </td>
  {/if}
  <td>{item.fullName}</td>
{/snippet}

<AddInventoryModal
  bind:dialog={addInventoryDialog}
  {client}
/>
<ModifyInventoryModal
  bind:dialog={modifyInventoryDialog}
  {client}
  bind:inventoryId={selectedInventoryId}
  onupdate={getInventoryList}
  {isGrosir}
/>
<Collapse title="Inventory"
  class="w-full"
  onClick={getInventoryList}
>
  <PaginationNavigationPanel
    bind:max
    bind:search
    bind:page
    onreload={getInventoryList}
    onadd={showAddInventory}
  />
  <DropdownSelect
    bind:selectValue={memberLevel}
    display="LABEL"
    placeholder="None"
    options={[
      [null, 'None'],
      ['SILVER', 'Silver'],
      ['GOLD', 'Gold'],
      ['PLATINUM', 'Platinum'],
    ]}
  />
  {#if inventoryList.length > 0}
    <Table5
      {header}
      {content}
      itemList={inventoryList}
    />
  {/if}
</Collapse>
