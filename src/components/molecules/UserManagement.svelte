<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { Context } from '@/lib/helper/context';
  import { cancelableDebounce, debounce } from '@/lib/helper/util';
  import type { DropdownReturnType } from '@/types/component';
  import type { Role, User } from '@/types/user';
  import { untrack, type Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidXmark } from 'svelte-icons-pack/fa';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import RoleDropdownSelect from './RoleDropdownSelect.svelte';
  import { getPaginationParams } from '@/lib/helper/pagination';
  import { stringToast } from '@/lib/helper/toast';

  type Props = {
    show?: boolean,
  };
  let {
    show = $bindable(),
  }: Props = $props();

  const { client, auth } = Context.strict;

  let {
    page,
    max,
    search,
  } = $state(getPaginationParams());
  let userList:User[] = $state([]);
  let roleList:Role[] = $state([]);
  let roleSearch = $state('');

  async function getUserList() {
    if (!$auth.loggedIn) return stringToast('You are not logged in');
    stringToast('Fetching user list');
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    const response = await client.get(
      '/users',
      { params },
    );
    if (response.status !== 200) return stringToast('Failed to fetch user list');
    userList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 1;
    stringToast('User list fetched');
  }

  const [debounceGetData] = cancelableDebounce(getUserList);

  $effect(() => {
    if (!show) return;
    search;
    page;
    untrack(debounceGetData);
  });

  let excludeRoleId:string[] = $state([]);

  $effect(() => {
    if (!show) return;
    excludeRoleId;
    getRoleList();
  });

  function excludeRole(userRoleList: Role[]) {
    return () => {
      roleSearch = '';
      roleList = [];
      excludeRoleId = userRoleList.map((role) => role.id);
    };
  }

  async function getRoleList() {
    if (!$auth.loggedIn) return;
    const params = new URLSearchParams({
      search: roleSearch,
    });
    excludeRoleId.forEach((roleId) => {
      params.append('excludeId', roleId);
    });
    const response = await client.get(
      '/role',
      { params },
    );
    if (response.status !== 200) return;
    roleList = response.data?.data ?? [];
  }

  const debounceGetRoleList = debounce(getRoleList);

  $effect(() => {
    if (!show) return;
    roleSearch;
    debounceGetRoleList();
  });

  function reloadData() {
    getUserList();
    getRoleList();
  }

  listenAuthSuccess(() => {
    if (!show) return;
    reloadData();
  });

  function addRole(id: string) {
    return async (roleId: string): Promise<DropdownReturnType<string>> => {
      const params  = new URLSearchParams({
        type: 'ADD',
      });
      const response = await client.patch(
        `/users/role/${id}`,
        { roleId },
        { params },
      );
      if (response.status !== 200) return;
      getUserList();
      return {
        selectValue: undefined,
        search: '',
      };
    };
  }

  function deleteRole(id: string, roleId: string) {
    return async (): Promise<undefined> => {
      const params  = new URLSearchParams({
        type: 'DELETE',
      });
      const response = await client.patch(
        `/users/role/${id}`,
        { roleId },
        { params },
      );
      if (response.status !== 200) return;
      getUserList();
      return;
    };
  }
</script>

{#snippet colgroup()}
  <colgroup>
    <col>
    <col>
    <col>
    <col>
    <col>
    <col class="w-full">
  </colgroup>
{/snippet}

{#snippet header()}
  <th>Id</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>Phone</th>
  <th>Email</th>
  <th>Role</th>
{/snippet}

{#snippet dropdownContainer(content: Snippet)}
  <ul class="menu input-bordered border dropdown-content bg-base-100 rounded-box z-1000 w-fit p-0 shadow-sm right-0">
    {@render content()}
  </ul>
{/snippet}

{#snippet content(item: User)}
  <td><NoWrap>{item.id}</NoWrap></td>
  <td><NoWrap>{item.profile?.firstName ?? '-'}</NoWrap></td>
  <td><NoWrap>{item.profile?.lastName ?? '-'}</NoWrap></td>
  <td><NoWrap>{item.phone}</NoWrap></td>
  <td><NoWrap>{item.email}</NoWrap></td>
  <td>
    <div class="inline-flex gap-4">
      {#each item.roles as role}
        <div class="indicator">
          <span class="indicator-item badge bg-slate-800 text-black overflow-clip px-0">
            <button class="btn min-h-[none] h-6 py-0 px-1 bg-slate-800"
              onclick={deleteRole(item.id, role.id)}
            >
              <Icon
                src={FaSolidXmark}
              />
            </button>
          </span>
          <button class="btn btn-secondary">{role.roleName}</button>
        </div>
      {/each}
      <DropdownSelect
        bind:search={roleSearch}
        display="LABEL"
        class="w-fit"
        options={roleList.map((role) => [role.id, role.roleName])}
        onclick={excludeRole(item.roles)}
        onselect={addRole(item.id)}
        {placeholder}
        {dropdownContainer}
      />
      <RoleDropdownSelect/>
    </div>
  </td>
{/snippet}

{#snippet placeholder()}
  <Icon src={FaSolidPlus}/>
{/snippet}

<Collapse5
  title="User Management"
  class="w-full"
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
  />
  {#if userList.length > 0}
    <Table5
      itemList={userList}
      {colgroup}
      {header}
      {content}
    />
  {/if}
</Collapse5>
