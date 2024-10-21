<script lang="ts">
  import type { AxiosInstance, AxiosRequestConfig } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import SearchField from '../atoms/SearchField.svelte';
  import { debounce, toURLStringEntries } from '@/lib/helper/util';
  import BulkCreateInventoryWorker from '@/worker/BulkCreateInventoryWorker?worker';

  export let client:AxiosInstance;

  const worker = new BulkCreateInventoryWorker();

  let companyList:object[] = [];
  let page = 1;
  let max = 1;
  let search = '';

  const getCompanyList = async () => {
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('$page', `${page}`);
    const response = await client.get(
      '/company/seller',
      {
        params,
      },
    );
    if (response.status === 200) {
      companyList = response.data?.data ?? [];
      max = response.data?.totalPage;
    }
  };

  const debounceGetCompany = debounce(getCompanyList);

  $: {
    search;
    page = 1;
  }

  $: {
    page;
    search;
    debounceGetCompany();
  }

  const onBulkAddInventory = () => {
    const params = toURLStringEntries({
      search,
    });
    const config: AxiosRequestConfig = {
      url: '/company/seller',
      baseURL: client.defaults.baseURL,
    };
    worker.postMessage({
      config,
      params,
    });
  };
</script>

<Collapse title="Companies"
  class="w-full"
  onClick={getCompanyList}
>
  <SearchField
    bind:value={search}
  />
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  <button class="btn bordered input-bordered"
    on:click={onBulkAddInventory}
  >
    Bulk Add Inventory
  </button>
  {#if companyList.length > 0}
    <Table itemList={companyList}/>
  {/if}
</Collapse>
