<script lang="ts">
  import type { AxiosInstance } from 'axios';
  import Modal from '../Modal.svelte';
  import type { Writable } from 'svelte/store';
  import type { AuthStore } from '@/types';
  import type { Category } from '@/types/category';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import AddCategoryModal from './AddCategoryModal.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';

  type Props = {
    parentId: string,
    client: AxiosInstance,
    store: Writable<AuthStore>,
    dialog?: HTMLDialogElement,
  };
  let {
    parentId = $bindable(),
    client,
    store,
    dialog = $bindable(),
  }: Props = $props();

  let subCategoryList:Category[] = $state([]);
  async function reloadData() {
    if (!$store.loggedIn) {
      throw new Error('Not logged in');
    }
    if (parentId === '') return;
    const params = new URLSearchParams({
      parentId,
    });
    const response = await client.get('/category/sub', { params });
    if (response.status !== 200) {
      throw new Error('Failed to load data');
    }
    subCategoryList = response.data?.data ?? [];
  }

  $effect(() => {
    if (parentId) {
      reloadData();
    }
  });

  let addSubCategoryDialog:HTMLDialogElement|undefined = $state();
  function showAddModal() {
    addSubCategoryDialog?.showModal();
  }
</script>

{#snippet colgroup()}
  <colgroup>
    <col>
    <col>
    <col>
    <col class="w-full">
  </colgroup>
{/snippet}

{#snippet header()}
  <th><span>Id</span></th>
  <th><span>Code</span></th>
  <th><span>Image</span></th>
  <th><span>Name</span></th>
{/snippet}

{#snippet content(category: Category)}
  <td><NoWrap>{category.id}</NoWrap></td>
  <td><NoWrap>{category.code}</NoWrap></td>
  <td>
    <img class="aspect-square max-w-16" src={category.image} alt="">
  </td>
  <td><NoWrap>{category.name}</NoWrap></td>
{/snippet}

<AddCategoryModal
  bind:dialog={addSubCategoryDialog}
  bind:parentId
  {client}
  {store}
/>
<Modal bind:dialog>
  <div class="w-full h-full">
    <PaginationNavigationPanel
      onreload={reloadData}
      onadd={showAddModal}
    />
    <Table5
      itemList={subCategoryList}
      {colgroup}
      {header}
      {content}
    />
  </div>
</Modal>
