<script lang="ts">
  import PaginationFancyButton from '@/components/atoms/PaginationFancyButton.svelte';
  import SearchField from '@/components/atoms/SearchField.svelte';
  import Collapse from '@/components/Collapse.svelte';
  import AddInventoryModal from '@/components/molecules/AddInventoryModal.svelte';
  import Table from '@/components/Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AxiosInstance } from 'axios';

  export let client:AxiosInstance;

  let inventoryList:object[] = [];
  let page = 1;
  let max = 1;
  let search = '';

  const getInventoryList = async () => {
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

  $: {
    search;
    page = 1;
  }

  $: {
    page;
    search;
    debounceGetInventory();
  }

  let addInventoryDialog:HTMLDialogElement|undefined;
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
  <SearchField
    bind:value={search}
  />
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  <button class="btn bordered input-bordered"
    on:click={onShowAddInventory}
  >
    Add Inventory
  </button>
  {#if inventoryList.length > 0}
    <Table itemList={inventoryList}/>
  {/if}
</Collapse>
