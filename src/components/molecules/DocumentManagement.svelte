<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import { debounce } from '@/lib/helper/util';
  import type { Document } from '@/types/document';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddDocumentModal from './AddDocumentModal.svelte';
  import ModifyDocumentModal from './ModifyDocumentModal.svelte';
  import EditButton from '../atoms/EditButton.svelte';

  type Props = {
    client: AxiosInstance,
    show?: boolean,
  };
  let {
    client,
    show = $bindable(false),
  }: Props = $props();

  let search = $state(''); 
  let page = $state(1);
  let max = $state(1);

  let documentList:Document[] = $state([]);

  async function reloadData() {
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    stringToast('Loading...');
    const response = await client.get('/document', { params });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    documentList = response.data?.data ?? [];
    max = response.data?.meta?.totalPage ?? 1;
  }

  const debounceReloadData = debounce(reloadData);

  $effect(() => {
    search;
    page = 1;
    max = 1;
  });

  $effect(() => {
    if (show) {
      search;
      page;
      max;
      debounceReloadData();
    }
  });

  let addDocumentDialog = $state<HTMLDialogElement>();
  function showAddModal() {
    addDocumentDialog?.showModal();
  }

  function deleteDocument(item: Document) {
    return async () => {
      await client.delete(`/document/${item.id}`);
      await reloadData();
    };
  }

  let selectedDocument:Document|undefined = $state();
  let modifyDocumentDialog = $state<HTMLDialogElement>();
  function modifyDocument(item: Document) {
    return async () => {
      selectedDocument = item;
      modifyDocumentDialog?.showModal();
    };
  }
  function onSudcessModifyDocument() {
    reloadData();
  }
</script>

<AddDocumentModal bind:dialog={addDocumentDialog} {client} onsuccess={reloadData}/>
<ModifyDocumentModal bind:dialog={modifyDocumentDialog} bind:item={selectedDocument} {client} onsuccess={onSudcessModifyDocument}/>
<Collapse5
  title="Document Management"
  class="w-full"
  bind:show
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  {#if documentList.length > 0}
    <Table5 itemList={documentList}>
      {#snippet table(tableContent: Snippet)}
        <table class="table table-zebra table-pin-cols">
          {@render tableContent()}
        </table>
      {/snippet}
      {#snippet lastColumn(item)}
        <th class="flex gap-2">
          <EditButton onclick={modifyDocument(item)}/>
          <DeleteButton onclick={deleteDocument(item)}/>
        </th>
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
