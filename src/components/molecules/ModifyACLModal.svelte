<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { isObjectEmpty } from '@/lib/helper/util';
  import type { ACLItem, APIACLItem } from '@/types';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidFloppyDisk } from 'svelte-icons-pack/fa';
  import Modal from '../Modal.svelte';
  import Table5 from '../Table5.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import SaveButton from '../atoms/SaveButton.svelte';
  import FeatureDropdownSelect from './FeatureDropdownSelect.svelte';
  import RoleDropdownSelect from './RoleDropdownSelect.svelte';

  type Props = {
    item?: APIACLItem,
    dialog?: HTMLDialogElement,
    onmodify?: () => void,
  };
  let {
    item = $bindable(),
    dialog = $bindable(),
    onmodify,
  }: Props = $props();

  const { client, auth: store } = Context.strict;

  let acls:Record<string, ACLItem> = $state({});
  let addingNewAcl = $state(false);

  $effect(() => {
    if (item?.acls) {
      acls = Object.fromEntries(item.acls.map((acl) => [acl.id, acl]));
    }
  });

  const updateACL = (target: ACLItem) => async () => {
    const payload: Partial<ACLItem> = {
      methodGet: target.methodGet,
      methodFind: target.methodFind,
      methodPost: target.methodPost,
      methodPatch: target.methodPatch,
      methodDelete: target.methodDelete,
    };
    if (target.apiId) {
      payload.apiId = target.apiId;
    }
    if (target.roleId) {
      payload.roleId = target.roleId;
    }
    stringToast('Updating ACL...');
    const response = await client.patch(
      `/acls/${target.id}`,
      payload,
    );
    if (response.status !== 200) {
      return stringToast('Failed to update ACL');
    }
    stringToast('ACL updated successfully');
    onmodify?.();
  };

  const newACL = $state({
    roleId: <string|null>null,
    featureId: <string|null>null,
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
    if (!$store.loggedIn) return;
    const response = await client.post(
      '/acls',
      newACL,
    );
    if (response.status !== 200) return;
    addingNewAcl = false;
    newACL.roleId = null;
    newACL.featureId = null;
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

<Modal
  bind:dialog
  title={item?.id}
>
  {#if item}
    <div>
      <span class="badge badge-neutral">{item.endpoint}</span>
      <div class="label"></div>
      <button class="btn btn-secondary w-fit"
        onclick={toggleAddingACL}
      >
        Add ACL
      </button>
      <div class="label"></div>
      {#if addingNewAcl}
        <div id="new-acl-panel" class="w-fit p-4 border bordered border-white grid gap-4">
          <span class="w-80">Role</span>
          <span class="w-80">Feature</span>
          <span>Save</span>
          <span>Get</span>
          <span>Find</span>
          <span>Post</span>
          <span>Patch</span>
          <span>Delete</span>
          <RoleDropdownSelect bind:value={newACL.roleId}/>
          <FeatureDropdownSelect bind:value={newACL.featureId}/>
          <button
            class="btn btn-secondary w-fit"
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
          class="grow"
          itemList={item.acls.toSorted((first, second) => first.createdAt < second.createdAt ? -1 : 1)}
        >
          {#snippet colgroup()}
            <colgroup>
              <col class="max-w-fit">
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
            <td>Id</td>
            <td>Role Name</td>
            <td>Feature Name</td>
            <td></td>
            <td></td>
            <td>Get</td>
            <td>Find</td>
            <td>Post</td>
            <td>Patch</td>
            <td>Delete</td>
          {/snippet}

          {#snippet content(acl: ACLItem)}
            {#if acl.id in acls}
              <td><NoWrap>{acl.id}</NoWrap></td>
              <td><NoWrap>{acl.role?.roleName}</NoWrap></td>
              <td><NoWrap>{acl.features?.[0]?.name}</NoWrap></td>
              <td><SaveButton onclick={updateACL(acls[acl.id])}/></td>
              <td><DeleteButton/></td>
              <td><input type="checkbox" bind:checked={acls[acl.id].methodGet} class="checkbox"></td>
              <td><input type="checkbox" bind:checked={acls[acl.id].methodFind} class="checkbox"></td>
              <td><input type="checkbox" bind:checked={acls[acl.id].methodPost} class="checkbox"></td>
              <td><input type="checkbox" bind:checked={acls[acl.id].methodPatch} class="checkbox"></td>
              <td><input type="checkbox" bind:checked={acls[acl.id].methodDelete} class="checkbox"></td>
            {/if}
          {/snippet}
        </Table5>
      {/if}
    </div>
  {/if}
</Modal>

<style>
  #new-acl-panel {
    grid-template-columns: repeat(8, max-content);
  }
</style>
