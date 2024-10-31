<script lang="ts">
  import { isObjectEmpty } from '@/lib/helper/util';
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
    const response = await client.get('/role');
    if (response.status !== 200) return;
    roleList = response.data?.data ?? [];
  }

  $effect(() => {
    getRoleList();
  });

  let acls:Record<string, ACLItem> = $state({});
  let addingNewAcl = $state(false);
  let roleList:Role[] = $state([]);

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

  $inspect({ roleList });
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
  {#if item && !isObjectEmpty(acls)}
    <div>
      <span class="badge badge-neutral">{item.endpoint}</span>
      <div class="label"></div>
      <button class="btn bg-slate-600 w-fit"
        onclick={() => addingNewAcl = !addingNewAcl}
      >
        Add ACL
      </button>
      <div class="label"></div>
      {#if addingNewAcl}
        <div id="new-acl-panel" class="w-fit p-4 border bordered border-white grid gap-2">
          <span>Role</span>
          <span>Save</span>
          <span>Get</span>
          <span>Find</span>
          <span>Post</span>
          <span>Patch</span>
          <span>Delete</span>
          <DropdownSelect
            options={roleList.map((role) => [role.id, role.roleName])}
            placeholder="ROLE"
          />
          <button
            class="btn bg-slate-600 w-fit"
          >
            <Icon src={FaSolidFloppyDisk}/>
          </button>
          <input type="checkbox" class="checkbox">
          <input type="checkbox" class="checkbox">
          <input type="checkbox" class="checkbox">
          <input type="checkbox" class="checkbox">
          <input type="checkbox" class="checkbox">
        </div>
      {/if}
      <div class="label"></div>
      <Table5
        class="flex-grow"
        itemList={item.acls.sort((first, second) => first.createdAt < second.createdAt ? -1 : 1)}
        {colgroup}
        {header}
        {content}
      >
      </Table5>
    </div>
  {/if}
</Modal>

<style>
  #new-acl-panel {
    grid-template-columns: repeat(7, max-content);
  }
</style>
