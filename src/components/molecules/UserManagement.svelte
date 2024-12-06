<script lang="ts">
  import { listenAuthSuccess } from '@/event';
  import { debounce } from '@/lib/helper/util';
  import { SuperAdminStore } from '@/store/store';
  import type { Role, User } from '@/types';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPlus, FaSolidXmark } from 'svelte-icons-pack/fa';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import type { DropdownReturnType } from '@/types/component';

  type Props = {
    client: AxiosInstance,
  };
  let { client }:Props = $props();

  let userList:User[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');
  let roleList:Role[] = $state([]);
  let roleSearch = $state('');

  async function getUserList() {
    if (!$SuperAdminStore.loggedIn) return;
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    const response = await client.get(
      '/users',
      { params },
    );
    if (response.status !== 200) return;
    userList = response.data?.data ?? [];
  }

  $effect(() => {
    search;
    getUserList();
  });

  let excludeRoleId:string[] = $state([]);

  $effect(() => {
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
    if (!$SuperAdminStore.loggedIn) return;
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
    roleSearch;
    debounceGetRoleList();
  });

  function reloadData() {
    getUserList();
    getRoleList();
  }

  listenAuthSuccess(() => {
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
  <ul class="menu input-bordered border dropdown-content bg-base-100 rounded-box z-[1000] w-fit p-0 shadow right-0">
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
          <button class="btn bg-slate-600">{role.roleName}</button>
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
    </div>
  </td>
{/snippet}

{#snippet placeholder()}
  <Icon src={FaSolidPlus}/>
{/snippet}

<Collapse5
  title="User Management"
  class="w-full"
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
