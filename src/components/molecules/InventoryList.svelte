<script lang="ts">
  import Collapse from '@/components/Collapse.svelte';
  import AddInventoryModal from '@/components/molecules/AddInventoryModal.svelte';
  import Table from '@/components/Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
  };
  let {
    client,
    store,
  }:Props = $props();

  let inventoryList:object[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  const getInventoryList = async () => {
    if (!$store.loggedIn) return;
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('$page', `${page}`);
    const response = await client.get(
      '/inventory',
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
</script>

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
  />
  <button class="btn bordered input-bordered"
    onclick={onShowAddInventory}
  >
    Add Inventory
  </button>
  {#if inventoryList.length > 0}
    <Table itemList={inventoryList}/>
  {/if}
</Collapse>
