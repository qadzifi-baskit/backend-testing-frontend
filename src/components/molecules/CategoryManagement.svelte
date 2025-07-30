<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { Category } from '@/types/category';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidList, FaSolidTrash } from 'svelte-icons-pack/fa';
  import DropdownSelect from '../atoms/DropdownSelect.svelte';
  import FormInput from '../atoms/FormInput.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddCategoryModal from './AddCategoryModal.svelte';
  import ManageCategoryModal from './ManageCategoryModal.svelte';

  type Props = {
    show?: boolean,
    manage?: boolean,
    id?: string,
  };
  let {
    show = $bindable(),
    manage,
    id = $bindable(''),
  }: Props = $props();

  const { client, auth } = Context.strict;

  let search = $state('');
  let page = $state(1);
  let max = $state(1);
  let nameExact = $state('');
  let parentName = $state('');
  let grandparentId = $state('');
  let categoryType = $state('');

  $effect(() => {
    search;
    nameExact;
    parentName;
    page = 1;
  });

  let categoryList:Category[] = $state([]);

  async function reloadData() {
    if (!$auth.loggedIn) {
      return stringToast('Not logged in');
    }
    const params = new URLSearchParams({
      includeEmpty: 'true',
      name: search,
    });
    if (nameExact !== '') {
      params.append('nameExact', nameExact);
    }
    if (parentName !== '') {
      params.append('parentName', parentName);
    }
    if (categoryType) {
      params.append('type', categoryType);
    }
    if (id) {
      params.append('parentId', id);
    }
    if (grandparentId) {
      params.append('parentIdOfParent', grandparentId);
    }
    const response = await client.get('/category', { params });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    categoryList = response.data?.data ?? [];
    max = response.data?.totalPage ?? 1;
  }

  const [debounceReload, cancelDebounce] = cancelableDebounce(reloadData);

  function cancelAndReload() {
    cancelDebounce();
    reloadData();
  }

  $effect(() => {
    if (show) {
      setTimeout(cancelAndReload);
    }
  });

  $effect(() => {
    if (show) {
      search;
      nameExact;
      parentName;
      page;
      categoryType;
      grandparentId;
      debounceReload();
    }
  });

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
    if (!$auth.loggedIn) {
      return stringToast('Not logged in');
    }
    stringToast('Deleting category...');
    const response = await client.delete(`/category/${id}`);
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    await reloadData();
    return stringToast('Category deleted');
  }
</script>


<AddCategoryModal
  bind:dialog={addCategoryDialog}
  onsuccess={reloadData}
  bind:parentId={id}
/>
{#if manage}
  <ManageCategoryModal
    bind:parentId
    bind:dialog={subCategoryDialog}
  />
{/if}
<Collapse5
  bind:show
  title="Category Management"
>
  <div>
    <PaginationNavigationPanel
      bind:search
      bind:page
      bind:max
      onreload={reloadData}
      onadd={showAddModal}
    />
    <DropdownSelect
      placeholder="ALL"
      class="w-fit"
      options={[
        ['', 'All'],
        ['CATEGORY', 'Category'],
        ['SUB', 'Subcategory'],
        ['SEGMENT', 'Segment'],
      ]}
      bind:value={categoryType}
    />
    <div class="inline-block w-fit min-w-xs">
      <FormInput label="Name Exact" placeholder="name exact" bind:value={nameExact}/>
    </div>
    <div class="inline-block w-fit min-w-xs">
      <FormInput label="Parent Name" placeholder="parent name" bind:value={parentName}/>
    </div>
    <div class="inline-block w-fit min-w-xs">
      <FormInput label="Grandparent Id" placeholder="grandparent id" bind:value={grandparentId}/>
    </div>
  </div>
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
      <td><NoWrap class="font-mono">{category.id}</NoWrap></td>
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
