<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import type { AxiosInstance } from 'axios';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import { clamp } from '@/lib/helper/math';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore, User } from '@/types';
  import type { Writable } from 'svelte/store';
  import AddFieldTeamModal from './AddFieldTeamModal.svelte';
  import type { PaginationOrder } from '@/types/pagination';

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

  let userList:User[] = $state([]);
  let max = $state(1);
  let page = $state(1);
  let search = $state('');
  let sort:string|null = $state(null);
  let order:PaginationOrder = $state('ASC');

  async function getFieldTeam() {
    if ($store && !$store.loggedIn) return;
    const params = new URLSearchParams({
      $page: `${page}`,
      role,
      search,
    });
    if (companyId) {
      params.append('sellerId', companyId);
    }
    if (sort !== null) {
      params.append('$order', sort);
      params.append('$sort', order);
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
    sort;
    order;
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

{#snippet header()}
  <th>Created At</th>
  <th>Id</th>
  <th>E-Mail</th>
  <th>Phone</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>Status</th>
  <th>Last Access</th>
{/snippet}

{#snippet content(user: User)}
  <td>{user.createdAt}</td>
  <td>{user.id}</td>
  <td>{user.email}</td>
  <td>{user.phone}</td>
  <td>{user.profile?.firstName ?? '-'}</td>
  <td>{user.profile?.lastName ?? '-'}</td>
  <td>{user.status}</td>
  <td>{user.lastAccess ?? '-'}</td>
{/snippet}

<AddFieldTeamModal
  bind:dialog={addFieldTeamDialog}
  roleName={role}
  {store}
  {companyId}
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
    bind:sort
    bind:order
    sortOptions={[
      ['createdAt', 'Created At'],
    ]}
  />
  <Table5
    itemList={userList}
    {header}
    {content}
  />
</Collapse5>
