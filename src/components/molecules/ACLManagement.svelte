<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { debounce } from '@/lib/helper/util';
  import type { APIACLItem } from '@/types';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import FormInput from '../atoms/FormInput.svelte';
  import FormWrapper from '../atoms/FormWrapper.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Modal from '../Modal.svelte';
  import Table5 from '../Table5.svelte';
  import ModifyAclModal from './ModifyACLModal.svelte';
  import { stringToast } from '@/lib/helper/toast';

  type Props = {
    roleid?:string|string[],
    show?: boolean,
  };
  let {
    roleid: roleId = $bindable(),
    show = $bindable(),
  }:Props = $props();

  const { client, auth } = Context.strict;
  const showMethod = $derived(typeof roleId === 'string' || roleId?.length === 1);

  let aclList:APIACLItem[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');
  let selectedAclItem:APIACLItem|undefined = $state();

  async function getACLList() {
    if (!$auth.loggedIn) {
      return;
    }

    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    params.append('$limit', '10');
    params.append('$order', 'createdAt');
    params.append('search', search);
    if (roleId) {
      if (typeof roleId === 'string') {
        params.append('roleId', roleId);
      } else {
        roleId.forEach((id) => {
          params.append('roleId', id);
        });
      }
    }
    const response = await client.get(
      '/acls',
      { params },
    );
    if (response.status !== 200) {
      return stringToast('Failed to get ACL list');
    }
    aclList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 1;
  };

  const debounceGetACLList = debounce(getACLList);

  $effect(() => {
    page;
    search;
    debounceGetACLList();
  });

  $effect(() => {
    if (show && (typeof roleId === 'string' || roleId?.length === 1)) {
      getACLList();
    }
  });

  let modifyDialog:HTMLDialogElement|undefined = $state();

  const modifyAcl = (item:APIACLItem) => () => {
    selectedAclItem = item;
    modifyDialog?.showModal();
  };
  async function onModifyACL() {
    await getACLList();
    selectedAclItem = aclList.find((acl) => selectedAclItem?.id === acl.id);
    if (!selectedAclItem) {
      modifyDialog?.close();
    }
  }

  $effect(() => {
    if (modifyDialog) {
      modifyDialog.onclose = getACLList;
    }
  });

  let addDialog = $state<HTMLDialogElement>();
  const newACL = $state({
    roleId: '',
    apiId: '',
    methodPost: false,
    methodGet: false,
    methodPatch: false,
    methodDelete: false,
    methodFind: false,
  });
  function showAddAcl() {
    addDialog?.showModal();
  }

  $effect(() => {
    if (showMethod && roleId) {
      if (typeof roleId === 'string') {
        newACL.roleId = roleId;
      } else {
        newACL.roleId = roleId[0];
      }
    } else {
      newACL.roleId = '';
    }
  });
</script>

<Modal bind:dialog={addDialog} title="Add ACL">
  <div>
    <FormWrapper
      payload={newACL}
      path="/acls"
    >
      <FormInput disabled label="Role Id" bind:value={newACL.roleId}/>
    </FormWrapper>
  </div>
</Modal>
<ModifyAclModal
  bind:item={selectedAclItem}
  bind:dialog={modifyDialog}
  onmodify={onModifyACL}
/>
<Collapse5
  title="ACL Management"
  class="w-full"
  onClick={getACLList}
  bind:show
>
  <PaginationNavigationPanel
    bind:max
    bind:page
    bind:search
    onreload={getACLList}
    onadd={showMethod ? showAddAcl : undefined}
  />
  {#if aclList.length > 0}
    <Table5
      itemList={aclList}
    >
      {#snippet colgroup()}
        <colgroup>
          <col class="max-w-fit">
          <col class="max-w-fit">
          <col>
          <col>
          <col class="w-full">
        </colgroup>
      {/snippet}

      {#snippet header()}
        <td><span>Id</span></td>
        <td></td>
        <td><span>API Name</span></td>
        <td><span>API Group</span></td>
        <td><span>Endpoint</span></td>
        {#if showMethod}
          <td>Get</td>
          <td>Find</td>
          <td>Post</td>
          <td>Patch</td>
          <td>Delete</td>
        {/if}
      {/snippet}

      {#snippet content(item: APIACLItem)}
        <td><NoWrap>{item.id}</NoWrap></td>
        <td>
          <button
            onclick={modifyAcl(item)}
            class="btn btn-secondary"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td><NoWrap>{item.apiName}</NoWrap></td>
        <td><NoWrap>{item.apiGroup}</NoWrap></td>
        <td><NoWrap>{item.endpoint}</NoWrap></td>
        {#if showMethod}
          {@const acl = item.acls[0]}
          <td><input disabled type="checkbox" checked={acl.methodGet} class="checkbox"></td>
          <td><input disabled type="checkbox" checked={acl.methodFind} class="checkbox"></td>
          <td><input disabled type="checkbox" checked={acl.methodPost} class="checkbox"></td>
          <td><input disabled type="checkbox" checked={acl.methodPatch} class="checkbox"></td>
          <td><input disabled type="checkbox" checked={acl.methodDelete} class="checkbox"></td>
        {/if}
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
