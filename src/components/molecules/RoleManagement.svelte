<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce } from '@/lib/helper/util';
  import type { Role } from '@/types/user';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddRoleModal from './AddRoleModal.svelte';
  import EditButton from '../atoms/EditButton.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import Modal from '../Modal.svelte';
  import AclList from './ACLList.svelte';

  const { client, auth: store } = Context.strict;

  let roleList:Role[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');

  async function getRoleList() {
    if (!$store.loggedIn) return;
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

  let roleDetailDialog = $state<HTMLDialogElement>();
  let selectedAclId = $state('');
  let selectedName = $state('');
  function showRoleDetail(role:Role) {
    return () => {
      selectedAclId = role.id;
      selectedName = role.roleName;
      roleDetailDialog?.showModal();
    };
  }
  $inspect(() => {
    if (roleDetailDialog) {
      roleDetailDialog.onclose = () => {
        selectedName = selectedAclId = '';
      };
    }
  });
</script>

<AddRoleModal
  bind:dialog={addRoleDialog}
  {client}
/>
<Modal bind:dialog={roleDetailDialog} bind:title={selectedName}>
  <AclList show bind:roleid={selectedAclId}/>
</Modal>
<Collapse
  title="Role Management"
  class="w-full"
  onclick={getRoleList}
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onadd={showAddRole}
    onreload={getRoleList}
  />
  {#if roleList.length > 0}
    <Table5
      itemList={roleList}
    >
      {#snippet colgroup()}
        <col>
        <col>
        <col class="min-w-xs">
        <col class="w-full">
      {/snippet}
      {#snippet header()}
        <td>Id</td>
        <td>Name</td>
        <td>Desc</td>
        <td></td>
      {/snippet}
      {#snippet content(role)}
        <td><NoWrap>{role.id}</NoWrap></td>
        <td>{role.roleName}</td>
        <td>{role.description}</td>
        <td><EditButton onclick={showRoleDetail(role)}/></td>
      {/snippet}
    </Table5>
  {/if}
</Collapse>
