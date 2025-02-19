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
  import { SuperAdminStore } from '@/store/store';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  let apiList:APIItem[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  const getAPIList = async () => {
    if (!$SuperAdminStore.loggedIn) {
      return;
    }

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

  $effect(() => {
    page;
    search;
    debounceGetAPIList();
  });

  let addApiDialog:HTMLDialogElement|undefined = $state();

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
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onreload={getAPIList}
    onadd={showAddAPI}
  />
  {#if apiList.length > 0}
    <Table itemList={apiList}>
    </Table>
  {/if}
</Collapse>
