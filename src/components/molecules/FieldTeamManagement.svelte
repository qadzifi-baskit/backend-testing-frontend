<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import { clamp } from '@/lib/helper/math';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import type { Writable } from 'svelte/store';
  import AddFieldTeamModal from './AddFieldTeamModal.svelte';

  type Props = {
    client: AxiosInstance,
    role: string,
    title?: string,
    store?: Writable<AuthStore>,
    companyId?: string,
  };
  let {
    client,
    role,
    title = 'Field Team Management',
    store,
    companyId = $bindable(),
  }:Props = $props();

  let userList:object[] = $state([]);
  let max = $state(1);
  let page = $state(1);
  let search = $state('');

  async function getFieldTeam() {
    if ($store && !$store.loggedIn) return;
    const params = new URLSearchParams({
      $page: `${page}`,
      role,
      search,
    });
    if (companyId) {
      params.append('company_id', companyId);
    }
    const response = await client.get(
      '/company/user',
      { params },
    );
    if (response.status !== 200) return;
    userList = response.data?.data ?? [];
    max = clamp(response.data?.totalPage ?? 1, 1);
  }

  const debounceGetFieldTeam = debounce(getFieldTeam);

  $effect(() => {
    search;
    page = 1;
    max = 1;
  });

  $effect(() => {
    search;
    page;
    debounceGetFieldTeam();
  });

  listenAuthSuccess(() => {
    getFieldTeam();
  });

  let addFieldTeamDialog:HTMLDialogElement|undefined = $state();

  function openAddFieldTeamDialog() {
    addFieldTeamDialog?.showModal();
  }

  $effect(() => {
    if (addFieldTeamDialog) {
      addFieldTeamDialog.onclose = getFieldTeam;
    }
  });
</script>

<AddFieldTeamModal
  bind:dialog={addFieldTeamDialog}
  roleName={role}
  {client}
/>
<Collapse5
  {title}
>
  <PaginationNavigationPanel
    onreload={getFieldTeam}
    onadd={openAddFieldTeamDialog}
    bind:max
    bind:page
    bind:search
  />
  <Table5
    itemList={userList}
  />
</Collapse5>
