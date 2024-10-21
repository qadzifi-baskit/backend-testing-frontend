<script lang="ts">
  import type { APIItem } from '@/types';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import type { AxiosInstance } from 'axios';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';

  export let client:AxiosInstance;

  let apiList:APIItem[] = [];
  let page = 1;
  let max = 1;
  let search = '';

  const getAPIList = async () => {
    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    params.append('$limit', '10');
    params.append('search', search);
    const response = await client.get(
      '/api',
      { params },
    );
    if (response.status === 200) {
      apiList = response.data?.data ?? [];
      max = response.data?.totalPage ?? 1;
    }
  };

  $: {
    page;
    search;
    getAPIList();
  }
</script>

<Collapse
  title="API List"
  class="w-full"
  onClick={getAPIList}
>
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  {#if apiList.length > 0}
    <Table itemList={apiList}>
    </Table>
  {/if}
</Collapse>
