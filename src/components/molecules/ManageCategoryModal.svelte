<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import type { Category } from '@/types/category';
  import Modal from '../Modal.svelte';
  import Table5 from '../Table5.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import AddCategoryModal from './AddCategoryModal.svelte';
  import EntityCategoryHierarchyManagement from './EntityCategoryHierarchyManagement.svelte';

  type Props = {
    parentId: string,
    dialog?: HTMLDialogElement,
  };
  let {
    parentId = $bindable(),
    dialog = $bindable(),
  }: Props = $props();

  const { client, auth } = Context.strict;

  let subCategoryList:Category[] = $state([]);

  async function reloadData() {
    if (!$auth.loggedIn) {
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
      subCategoryList = [];
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
  store={auth}
  onsuccess={reloadData}
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
    <div class="divider"></div>
    <EntityCategoryHierarchyManagement
      path="tag"
      method="PATCH"
      parentofid={parentId}
    />
  </div>
</Modal>
