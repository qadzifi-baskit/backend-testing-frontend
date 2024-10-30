<script lang="ts">
  import type { AxiosInstance, AxiosRequestConfig } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import SearchField from '../atoms/SearchField.svelte';
  import { debounce, toURLStringEntries } from '@/lib/helper/util';
  import BulkCreateInventoryWorker from '@/worker/BulkCreateInventoryWorker?worker';
  import { BaskitAdminStore } from '@/store/store';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  const worker = new BulkCreateInventoryWorker();

  let companyList:object[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

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

  $effect(() => {
    search;
    page = 1;
  });

  $effect(() => {
    if ($BaskitAdminStore.loggedIn) {
      page;
      search;
      debounceGetCompany();
    }
  });

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
    onclick={onBulkAddInventory}
  >
    Bulk Add Inventory
  </button>
  {#if companyList.length > 0}
    <Table itemList={companyList}/>
  {/if}
</Collapse>
