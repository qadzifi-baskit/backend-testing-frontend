<script lang="ts">
  import { clamp } from '@/lib/helper/math';
  import { debounce } from '@/lib/helper/util';
  import type { AuthStore } from '@/types';
  import type { PaginationOrder } from '@/types/pagination';
  import type { User } from '@/types/user';
  import type { AxiosInstance } from 'axios';
  import type { Writable } from 'svelte/store';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddFieldTeamModal from './AddFieldTeamModal.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';

  type Props = {
    client: AxiosInstance,
    role: string|string[],
    title?: string,
    store?: Writable<AuthStore>,
    companyId?: string,
    show?: boolean,
  };
  let {
    client,
    role,
    title = 'Field Team Management',
    store,
    companyId = $bindable(),
    show = $bindable(false),
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
      search,
    });
    if (Array.isArray(role)) {
      role.forEach((r) => params.append('role', r));
    } else {
      params.append('role', role);
    }
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

  let addFieldTeamDialog:HTMLDialogElement|undefined = $state();

  function openAddFieldTeamDialog() {
    addFieldTeamDialog?.showModal();
  }

  $effect(() => {
    if (addFieldTeamDialog) {
      addFieldTeamDialog.onclose = getFieldTeam;
    }
  });

  $effect(() => {
    if (show) {
      getFieldTeam();
    }
  });
</script>

<AddFieldTeamModal
  bind:dialog={addFieldTeamDialog}
  roleName={role}
  {store}
  bind:companyId
  {client}
/>
<Collapse5
  {title}
  bind:show
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
  <Table5 itemList={userList}>
    {#snippet header()}
      <th>Created At</th>
      <th>Id</th>
      <th>E-Mail</th>
      <th>Phone</th>
      <th>Role</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Status</th>
      <th>Last Access</th>
    {/snippet}

    {#snippet content(user: User)}
      <td><NoWrap>{user.createdAt}</NoWrap></td>
      <td><NoWrap>{user.id}</NoWrap></td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{user.roles?.[0]?.roleName}</td>
      <td>{user.profile?.firstName ?? '-'}</td>
      <td>{user.profile?.lastName ?? '-'}</td>
      <td>{user.status}</td>
      <td>{user.lastAccess ?? '-'}</td>
    {/snippet}
  </Table5>
</Collapse5>
