<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { APIItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import SearchField from '../atoms/SearchField.svelte';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus } from 'svelte-icons-pack/fa';
  import AddApiModal from './AddAPIModal.svelte';

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

  const debounceGetAPIList = debounce(getAPIList);

  $: {
    page;
    search;
    debounceGetAPIList();
  }

  let addApiDialog:HTMLDialogElement|undefined;

  const showAddAPI = () => {
    addApiDialog?.showModal();
  };
</script>

<AddApiModal
  {client}
  bind:dialog={addApiDialog}
/>
<Collapse
  title="API List"
  class="w-full"
  onClick={getAPIList}
>
  <SearchField
    bind:value={search}
  />
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  <button
    on:click={showAddAPI}
    class="btn bg-slate-600"
  >
    <Icon src={FaSolidPlus}/>
  </button>
  {#if apiList.length > 0}
    <Table itemList={apiList}>
    </Table>
  {/if}
</Collapse>
