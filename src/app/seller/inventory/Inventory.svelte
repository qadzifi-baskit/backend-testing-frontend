<script lang="ts">
  import PaginationNavButton from '@/components/atoms/PaginationNavButton.svelte';
  import Collapse from '@/components/Collapse.svelte';
  import Table from '@/components/Table.svelte';
  import { debounce } from '@/lib/helper/util';
  import type { AxiosInstance } from 'axios';

  export let client:AxiosInstance;

  let inventoryList:object[] = [];
  let page = 1;
  let max = 100;
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
    page;
    search;
    debounceGetInventory();
  }
</script>

<Collapse title="Inventory"
  class="w-full"
  onClick={getInventoryList}
>
  <label class="input input-bordered flex items-center gap-2">
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
  <PaginationNavButton
    bind:max
    bind:value={page}
  />
  {#if inventoryList.length > 0}
    <Table itemList={inventoryList}/>
  {/if}
</Collapse>
