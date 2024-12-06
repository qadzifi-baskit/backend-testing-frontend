<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import { SuperAdminStore } from '@/store/store';
  import type { APIACLItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse from '../Collapse.svelte';
  import Table5 from '../Table5.svelte';
  import ModifyAclModal from './ModifyACLModal.svelte';

  type Props = {
    client: AxiosInstance,
  };
  let {
    client,
  }:Props = $props();

  let aclList:APIACLItem[] = $state([]);
  let page = $state(1);
  let max = $state(1);
  let search = $state('');
  let selectedAclItem:APIACLItem|undefined = $state();

  const getACLList = async () => {
    if (!$SuperAdminStore.loggedIn) {
      return;
    }

    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    params.append('$limit', '10');
    params.append('$order', 'createdAt');
    params.append('search', search);
    const response = await client.get(
      '/acls',
      { params },
    );
    if (response.status === 200) {
      max = response.data?.totalPage ?? 1;
      aclList = response.data?.data ?? [];
    }
  };

  const debounceGetACLList = debounce(getACLList);

  $effect(() => {
    page;
    search;
    debounceGetACLList();
  });

  let dialog:HTMLDialogElement|undefined = $state();

  const modifyAcl = (item:APIACLItem) => () => {
    selectedAclItem = item;
    dialog?.showModal();
  };

  $effect(() => {
    if (dialog) {
      dialog.onclose = getACLList;
    }
  });
</script>

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
  <th><span>Id</span></th>
  <th></th>
  <th><span>API Name</span></th>
  <th><span>API Group</span></th>
  <th><span>Endpoint</span></th>
{/snippet}

{#snippet content(item: APIACLItem)}
  <td><NoWrap>{item.id}</NoWrap></td>
  <td>
    <button
      onclick={modifyAcl(item)}
      class="btn bg-slate-600"
    >
      <Icon src={FaSolidPencil}/>
    </button>
  </td>
  <td><NoWrap>{item.apiName}</NoWrap></td>
  <td><NoWrap>{item.apiGroup}</NoWrap></td>
  <td><NoWrap>{item.endpoint}</NoWrap></td>
{/snippet}

<ModifyAclModal
  item={selectedAclItem}
  bind:dialog
  {client}
/>
<Collapse
  title="ACL List"
  class="w-full"
  onClick={getACLList}
>
  <PaginationNavigationPanel
    bind:max
    bind:page
    bind:search
    onreload={getACLList}
  />
  {#if aclList.length > 0}
    <Table5
      itemList={aclList}
      {header}
      {colgroup}
      {content}
    >
    </Table5>
  {/if}
</Collapse>
