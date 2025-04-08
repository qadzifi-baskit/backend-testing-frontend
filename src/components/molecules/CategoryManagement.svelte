<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import type { AuthStore } from '@/types';
  import type { Category } from '@/types/category';
  import type { AxiosInstance } from 'axios';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList, FaSolidTrash } from 'svelte-icons-pack/fa';
  import type { Writable } from 'svelte/store';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddCategoryModal from './AddCategoryModal.svelte';
  import SubCategoryModal from './SubCategoryModal.svelte';

  type Props = {
    client: AxiosInstance,
    store: Writable<AuthStore>,
  };
  let {
    client,
    store,
  }: Props = $props();

  let search = $state('');
  let page = $state(1);
  let max = $state(1);
  let nameExact = $state('');

  let categoryList:Category[] = $state([]);

  async function reloadData() {
    if (!$store.loggedIn) {
      return stringToast('Not logged in');
    }
    const params = new URLSearchParams({
      includeEmpty: 'true',
    });
    if (nameExact !== '') {
      params.append('nameExact', nameExact);
    }
    const response = await client.get('/category', { params });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    categoryList = response.data?.data ?? [];
  }

  let addCategoryDialog:HTMLDialogElement|undefined = $state();
  function showAddModal() {
    addCategoryDialog?.showModal();
  }

  let subCategoryDialog:HTMLDialogElement|undefined = $state();
  let parentId = $state('');
  function showSubCategoryModal(targetId: string) {
    parentId = targetId;
    subCategoryDialog?.showModal();
  }
  $effect(() => {
    if (subCategoryDialog) {
      subCategoryDialog.onclose = () => {
        parentId = '';
      };
    }
  });

  async function deleteCategory(id: string) {
    if (!$store.loggedIn) {
      return stringToast('Not logged in');
    }
    const response = await client.delete(`/category/${id}`);
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    await reloadData();
    return stringToast('Category deleted');
  }
</script>


<AddCategoryModal
  {client}
  {store}
  bind:dialog={addCategoryDialog}
  onsuccess={reloadData}
/>
<SubCategoryModal
  bind:parentId
  bind:dialog={subCategoryDialog}
  {client}
  {store}
/>
<Collapse5
  title="Category Management"
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  <label class="form-control w-full max-w-xs mb-2">
    <div class="label">
      <span class="label-text">Name Exact</span>
    </div>
    <input type="text" placeholder="key" bind:value={nameExact} class="input input-bordered w-full max-w-xs" />
  </label>
  <Table5 itemList={categoryList}>
    {#snippet table(tableContent: Snippet)}
      <table class="table table-zebra table-pin-cols">
        {@render tableContent()}
      </table>
    {/snippet}

    {#snippet colgroup()}
      <colgroup>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col class="w-full">
        <col class="max-w-fit">
      </colgroup>
    {/snippet}

    {#snippet header()}
      <td></td>
      <td><span>Id</span></td>
      <td><span>Code</span></td>
      <td></td>
      <td><span>Image</span></td>
      <td><span>Name</span></td>
      <td></td>
    {/snippet}

    {#snippet content(category: Category, index: number)}
      <th>{index + 1}</th>
      <td><NoWrap>{category.id}</NoWrap></td>
      <td><NoWrap>{category.code}</NoWrap></td>
      <td>
        <button class="btn btn-secondary"
          onclick={() => showSubCategoryModal(category.id)}
        >
          <Icon src={FaSolidList}/>
        </button>
      </td>
      <td>
        <img class="aspect-square max-w-16" src={category.image} alt="">
      </td>
      <td><NoWrap>{category.name}</NoWrap></td>
      <td>
        <button class="btn btn-secondary"
          onclick={() => deleteCategory(category.id)}
        >
          <Icon src={FaSolidTrash}/>
        </button>
      </td>
    {/snippet}
  </Table5>
</Collapse5>
