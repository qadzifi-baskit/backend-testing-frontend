<script lang="ts">
  import { debounce } from '@/lib/helper/util';
  import type { APIACLItem } from '@/types';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationFancyButton from '../atoms/PaginationFancyButton.svelte';
  import SearchField from '../atoms/SearchField.svelte';
  import Collapse from '../Collapse.svelte';
  import Table from '../Table.svelte';
  import ModifyAclModal from './ModifyACLModal.svelte';

  export let client:AxiosInstance;

  let aclList:APIACLItem[] = [];
  let page = 1;
  let max = 1;
  let search = '';
  let selectedAclItem:APIACLItem|undefined;

  const getACLList = async () => {
    const params = new URLSearchParams();
    params.append('$page', `${page}`);
    params.append('$limit', '10');
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

  $: {
    page;
    search;
    debounceGetACLList();
  }

  let dialog:HTMLDialogElement|undefined;

  const modifyAcl = (item:APIACLItem) => () => {
    selectedAclItem = item;
    dialog?.showModal();
  };

  $: if (dialog) {
    dialog.onclose = getACLList;
  }
</script>

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
  <SearchField
    bind:value={search}
  />
  <PaginationFancyButton
    bind:max
    bind:value={page}
  />
  {#if aclList.length > 0}
    <Table itemList={aclList.sort((first, second) => first.createdAt < second.createdAt ? -1 : 1)}>
      <svelte:fragment slot="colgroup">
        <colgroup>
          <col class="max-w-fit">
          <col class="max-w-fit">
          <col>
          <col>
          <col class="w-full">
        </colgroup>
      </svelte:fragment>
      <svelte:fragment slot="header">
        <th><span>Id</span></th>
        <th></th>
        <th><span>API Name</span></th>
        <th><span>API Group</span></th>
        <th><span>Endpoint</span></th>
      </svelte:fragment>
      <svelte:fragment slot="item" let:item>
        <td><NoWrap>{item.id}</NoWrap></td>
        <td>
          <button
            on:click={modifyAcl(item)}
            class="btn bg-slate-600"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td><NoWrap>{item.apiName}</NoWrap></td>
        <td><NoWrap>{item.apiGroup}</NoWrap></td>
        <td><NoWrap>{item.endpoint}</NoWrap></td>
      </svelte:fragment>
    </Table>
  {/if}
</Collapse>
