<script lang="ts">
  import type { ACLItem, APIACLItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import Modal from '../Modal.svelte';
  import Table from '../Table.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';

  export let item:APIACLItem|undefined;
  export let client:AxiosInstance;
  export let dialog:HTMLDialogElement|undefined;

  let acls:Record<string, ACLItem> = {};

  $: if (item?.acls) {
    acls = Object.fromEntries(item.acls.map((acl) => [acl.id, acl]));
  }

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

</script>

<Modal
  bind:dialog
>
  {#if item}
    <div>
      <span class="badge badge-neutral">{item.endpoint}</span>
      <div class="label"></div>
      <div class="label"></div>
      <Table itemList={item.acls.sort((first, second) => first.createdAt < second.createdAt ? -1 : 1)}>
        <svelte:fragment slot="colgroup">
          <colgroup>
            <col class="max-w-fit">
            <col class="max-w-fit">
            <col>
            <col>
            <col>
            <col>
            <col>
            <col class="w-full">
          </colgroup>
        </svelte:fragment>
        <svelte:fragment slot="header">
          <th>Id</th>
          <th>Role Name</th>
          <th></th>
          <th>Get</th>
          <th>Find</th>
          <th>Post</th>
          <th>Patch</th>
          <th>Delete</th>
        </svelte:fragment>
        <svelte:fragment slot="item" let:item={api}>
          <td><NoWrap>{api.id}</NoWrap></td>
          <td><NoWrap>{api.role.roleName}</NoWrap></td>
          <td>
            <button
              on:click={updateACL(acls[api.id])}
              class="btn bg-slate-600"
            >
              <Icon src={FaSolidPencil}/>
            </button>
          </td>
          <td><input type="checkbox" bind:checked={acls[api.id].methodGet} class="checkbox"></td>
          <td><input type="checkbox" bind:checked={acls[api.id].methodFind} class="checkbox"></td>
          <td><input type="checkbox" bind:checked={acls[api.id].methodPost} class="checkbox"></td>
          <td><input type="checkbox" bind:checked={acls[api.id].methodPatch} class="checkbox"></td>
          <td><input type="checkbox" bind:checked={acls[api.id].methodDelete} class="checkbox"></td>
        </svelte:fragment>
      </Table>
    </div>
  {/if}
</Modal>
