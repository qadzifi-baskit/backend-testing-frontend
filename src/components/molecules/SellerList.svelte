<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce, toURLStringEntries } from '@/lib/helper/util';
  import { BaskitAdminStore } from '@/store/store';
  import type { AxiosRequestConfig } from 'axios';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';

  //const worker = new BulkCreateInventoryWorker();

  const { client, auth } = Context.strict;

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
    if ($auth.loggedIn) {
      page;
      search;
      debounceGetCompany();
    }
  });

  const onBulkAddInventory = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = toURLStringEntries({
      search,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const config: AxiosRequestConfig = {
      url: '/company/seller',
      baseURL: client.defaults.baseURL,
    };
  };
</script>

<Collapse title="Companies"
  class="w-full"
  onclick={getCompanyList}
>
  <PaginationNavigationPanel
    bind:max
    bind:page
    bind:search
    onreload={getCompanyList}
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
