<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import { SuperAdminStore } from '@/store/store';
  import type { APIItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import AddApiModal from './AddAPIModal.svelte';
  import ModifyApiModal from './ModifyAPIModal.svelte';

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

  const reloadData = async () => {
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

  const debounceReloadData = debounce(reloadData);

  $effect(() => {
    page;
    search;
    debounceReloadData();
  });

  let addApiDialog:HTMLDialogElement|undefined = $state();

  const showAddAPI = () => {
    addApiDialog?.showModal();
  };

  let modifyApiDialog:HTMLDialogElement|undefined = $state();
  let selectedAPI:APIItem|undefined = $state();
  function modifyAPI(item:APIItem) {
    return () => {
      selectedAPI = item;
      modifyApiDialog?.showModal();
    };
  }
  function successModify() {
    stringToast('API modified');
    modifyApiDialog?.close();
    reloadData();
  }
</script>

<AddApiModal
  {client}
  bind:dialog={addApiDialog}
  onsuccess={reloadData}
/>
<ModifyApiModal
  {client}
  bind:dialog={modifyApiDialog}
  bind:item={selectedAPI}
  onsuccess={successModify}
/>
<Collapse
  title="API List"
  class="w-full"
  onclick={reloadData}
>
  <PaginationNavigationPanel
    bind:search
    bind:max
    bind:page
    onreload={reloadData}
    onadd={showAddAPI}
  />
  {#if apiList.length > 0}
    <Table5 itemList={apiList}>
      {#snippet colgroup()}
        <colgroup>
          <col class="max-w-fit">
          <col class="max-w-fit">
          <col>
          <col>
          <col>
          <col class="w-full">
        </colgroup>
      {/snippet}

      {#snippet header()}
        <th>Id</th>
        <th></th>
        <th>Name</th>
        <th>Group</th>
        <th>Description</th>
        <th>Endpoint</th>
      {/snippet}

      {#snippet content(api: APIItem)}
        <td><NoWrap>{api.id}</NoWrap></td>
        <td>
          <button
            onclick={modifyAPI(api)}
            class="btn btn-secondary"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td><NoWrap>{api.apiName}</NoWrap></td>
        <td><NoWrap>{api.apiGroup}</NoWrap></td>
        <td><NoWrap>{api.description}</NoWrap></td>
        <td><NoWrap>{api.endpoint}</NoWrap></td>
      {/snippet}
    </Table5>
  {/if}
</Collapse>
