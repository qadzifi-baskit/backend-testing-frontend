<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import AddInventoryModal from '@/components/molecules/AddInventoryModal.svelte';
  import Table from '@/components/Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore, Inventory } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Table5 from '../Table5.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
    isGrosir?: boolean,
    isOrder?: boolean,
    userId?: string,
  };
  let {
    client,
    store,
    isGrosir = false,
    isOrder = false,
    userId = $bindable(),
  }:Props = $props();

  const prefix = isGrosir ? '/grosirindo' : '';

  let inventoryList:Inventory[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  const getInventoryList = async () => {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('$page', `${page}`);
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
  const onShowAddInventory = () => {
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
    });
  }
</script>

{#snippet header()}
  <th>Stock</th>
  <th>Status</th>
  <th>Price</th>
  <th>Qty</th>
  <th></th>
  <th>Name</th>
{/snippet}

{#snippet content(item: Inventory)}
  <td>{item.stock}</td>
  <td>{item.isActive}</td>
  <td>{item.sellingPrice}</td>
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
  <td>{item.fullName}</td>
{/snippet}

<AddInventoryModal
  bind:dialog={addInventoryDialog}
  {client}
/>
<Collapse title="Inventory"
  class="w-full"
  onClick={getInventoryList}
>
  <PaginationNavigationPanel
    bind:max
    bind:search
    bind:page
    onReload={getInventoryList}
  />
  <button class="btn bordered input-bordered"
    onclick={onShowAddInventory}
  >
    Add Inventory
  </button>
  {#if inventoryList.length > 0}
    {#if isOrder}
      <Table5
        {header}
        {content}
        itemList={inventoryList}
      />
    {:else}
      <Table itemList={inventoryList}/>
    {/if}
  {/if}
</Collapse>
