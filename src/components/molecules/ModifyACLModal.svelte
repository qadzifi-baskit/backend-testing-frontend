<script lang="ts">
  import { debounce, isObjectEmpty } from '@/lib/helper/util';
  import { SuperAdminStore } from '@/store/store';
  import type { ACLItem, APIACLItem, Role } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidFloppyDisk, FaSolidPencil } from 'svelte-icons-pack/fa';
  import Modal from '../Modal.svelte';
  import Table5 from '../Table5.svelte';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';

  type Props = {
    client: AxiosInstance,
    item?: APIACLItem,
    dialog?: HTMLDialogElement,
  };
  let {
    client,
    item = $bindable(),
    dialog = $bindable(),
  }: Props = $props();

  async function getRoleList() {
    if (!$SuperAdminStore.loggedIn) return;
    const params = new URLSearchParams({
      search: roleSearch,
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
    $SuperAdminStore.loggedIn;
    roleSearch;
    debounceGetRoleList();
  });

  let acls:Record<string, ACLItem> = $state({});
  let addingNewAcl = $state(false);
  let roleList:Role[] = $state([]);
  let roleSearch = $state('');

  $effect(() => {
    if (item?.acls) {
      acls = Object.fromEntries(item.acls.map((acl) => [acl.id, acl]));
    }
  });

  const updateACL = (target: ACLItem) => async () => {
    const payload: Partial<ACLItem> = {
      apiId: target.apiId,
      roleId: target.roleId,
      methodGet: target.methodGet,
      methodFind: target.methodFind,
      methodPost: target.methodPost,
      methodPatch: target.methodPatch,
      methodDelete: target.methodDelete,
    };
    const response = await client.patch(
      `/acls/${target.id}`,
      payload,
    );
    if (response.status !== 200) {
      return;
    }

    dialog?.close();
  };

  const newACL = $state({
    roleId: '',
    apiId: item?.id,
    methodPost: false,
    methodGet: false,
    methodPatch: false,
    methodDelete: false,
    methodFind: false,
  });

  $effect(() => {
    newACL.apiId = item?.id;
  });

  async function createACL() {
    if (!$SuperAdminStore.loggedIn) return;
    const response = await client.post(
      '/acls',
      newACL,
    );
    if (response.status !== 200) return;
    addingNewAcl = false;
    newACL.roleId = '';
    newACL.methodPost = false;
    newACL.methodGet = false;
    newACL.methodPatch = false;
    newACL.methodDelete = false;
    newACL.methodFind = false;
  }

  async function toggleAddingACL() {
    addingNewAcl = !addingNewAcl;
  }
</script>

{#snippet colgroup()}
  <colgroup>
    <col class="max-w-fit">
    <col class="max-w-fit">
    <col>
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
  <th>Role Name</th>
  <th></th>
  <th>Get</th>
  <th>Find</th>
  <th>Post</th>
  <th>Patch</th>
  <th>Delete</th>
{/snippet}

{#snippet content(acl: ACLItem)}
  {#if acl.id in acls}
    <td><NoWrap>{acl.id}</NoWrap></td>
    <td><NoWrap>{acl.role.roleName}</NoWrap></td>
    <td>
      <button
        onclick={updateACL(acls[acl.id])}
        class="btn bg-slate-600"
      >
        <Icon src={FaSolidPencil}/>
      </button>
    </td>
    <td><input type="checkbox" bind:checked={acls[acl.id].methodGet} class="checkbox"></td>
    <td><input type="checkbox" bind:checked={acls[acl.id].methodFind} class="checkbox"></td>
    <td><input type="checkbox" bind:checked={acls[acl.id].methodPost} class="checkbox"></td>
    <td><input type="checkbox" bind:checked={acls[acl.id].methodPatch} class="checkbox"></td>
    <td><input type="checkbox" bind:checked={acls[acl.id].methodDelete} class="checkbox"></td>
  {/if}
{/snippet}


<Modal
  bind:dialog
>
  {#if item}
    <div>
      <span class="badge badge-neutral">{item.endpoint}</span>
      <div class="label"></div>
      <button class="btn bg-slate-600 w-fit"
        onclick={toggleAddingACL}
      >
        Add ACL
      </button>
      <div class="label"></div>
      {#if addingNewAcl}
        <div id="new-acl-panel" class="w-fit p-4 border bordered border-white grid gap-4">
          <span class="w-80">Role</span>
          <span>Save</span>
          <span>Get</span>
          <span>Find</span>
          <span>Post</span>
          <span>Patch</span>
          <span>Delete</span>
          <DropdownSelect
            bind:search={roleSearch}
            bind:selectValue={newACL.roleId}
            showValue
            options={roleList.map((role) => [role.id, role.roleName])}
            display="LABEL"
            placeholder="ROLE"
          />
          <button
            class="btn bg-slate-600 w-fit"
            onclick={createACL}
          >
            <Icon src={FaSolidFloppyDisk}/>
          </button>
          <input type="checkbox" bind:checked={newACL.methodGet} class="checkbox self-center justify-self-center">
          <input type="checkbox" bind:checked={newACL.methodFind} class="checkbox self-center justify-self-center">
          <input type="checkbox" bind:checked={newACL.methodPost} class="checkbox self-center justify-self-center">
          <input type="checkbox" bind:checked={newACL.methodPatch} class="checkbox self-center justify-self-center">
          <input type="checkbox" bind:checked={newACL.methodDelete} class="checkbox self-center justify-self-center">
        </div>
      {/if}
      <div class="label"></div>
      {#if !isObjectEmpty(acls)}
        <Table5
          class="flex-grow"
          itemList={item.acls.toSorted((first, second) => first.createdAt < second.createdAt ? -1 : 1)}
          {colgroup}
          {header}
          {content}
        />
      {/if}
    </div>
  {/if}
</Modal>

<style>
  #new-acl-panel {
    grid-template-columns: repeat(7, max-content);
  }
</style>
