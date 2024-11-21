<script lang="ts">
  import { SuperAdminStore } from '@/store/store';
  import type { Role } from '@/types';
  import type { AxiosInstance } from 'axios';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddRoleModal from './AddRoleModal.svelte';
  import { debounce } from '@/lib/helper/util';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  let roleList:Role[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  async function getRoleList() {
    if (!$SuperAdminStore.loggedIn) return;
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('$page', `${page}`);
    const response = await client.get(
      '/role',
      {
        params,
      },
    );
    if (response.status !== 200) return;
    roleList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 0;
  }

  const debounceGetRoleList = debounce(getRoleList);

  $effect(() => {
    page;
    search;
    debounceGetRoleList();
  });

  let addRoleDialog:HTMLDialogElement|undefined = $state();
  function showAddRole() {
    addRoleDialog?.showModal();
  }

  $effect(() => {
    if (addRoleDialog) {
      addRoleDialog.onclose = getRoleList;
    }
  });
</script>

<AddRoleModal
  bind:dialog={addRoleDialog}
  {client}
/>
<Collapse
  title="Role Management"
  class="w-full"
  onClick={getRoleList}
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onAdd={showAddRole}
  />
  {#if roleList.length > 0}
    <Table5
      itemList={roleList}
    />
  {/if}
</Collapse>
