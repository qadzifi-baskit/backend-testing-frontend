<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { EntityCategory } from '@/types/entityCategory';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddEntityCategoryModal from './AddEntityCategoryModal.svelte';
  import EditButton from '../atoms/EditButton.svelte';
  import ModifyEntityCategoryModal from './ModifyEntityCategoryModal.svelte';
  import AddButton from '../atoms/AddButton.svelte';
  import DeleteButton from '../atoms/DeleteButton.svelte';
  import type { RequestMethod } from '@/types/http';

  type Props = {
    path?: string,
    method?: RequestMethod,
    class?: string,
    categoryid?: string,
    modify?: boolean,
    addcategory?: boolean,
    addchild?: boolean,
    onaddchild?: () => void,
    removechild?: boolean,
    onremovechild?: () => void,
    addparent?: boolean,
    onaddparent?: () => void,
    removeparent?: boolean,
    onremoveparent?: () => void,
    excludeid?: string,
    parentofid?: string,
    parentid?: string,
    excludeparentid?: string,
    excludeparentofid?: string,
    show?: boolean,
    alwaysshow?: boolean,
    title?: string,
  };
  let {
    path = 'parent',
    method = 'POST',
    class: clazz = $bindable(''),
    categoryid: categoryId,
    modify,
    addcategory: addCategory,
    addchild: addChild,
    onaddchild: onAddChild,
    removechild: removeChild,
    onremovechild: onRemoveChild,
    addparent: addParent,
    onaddparent: onAddParent,
    removeparent: removeParent,
    onremoveparent: onRemoveParent,
    excludeid: excludeId = $bindable(),
    parentofid: parentOfId = $bindable(),
    parentid: parentId = $bindable(),
    excludeparentid: excludeParentId = $bindable(),
    excludeparentofid: excludeParentOfId = $bindable(),
    show = $bindable(false),
    alwaysshow = $bindable(),
    title = 'Entity Category Management',
  }: Props = $props();

  const authStore = Context.getStrict('auth');
  const client = Context.getStrict('client');

  let search = $state('');
  let page = $state(1);
  let max = $state(1);
  let entityCategoryList = $state<EntityCategory[]>([]);

  async function reloadData() {
    if (!show && !alwaysshow) return;
    if (!$authStore.loggedIn) {
      return stringToast('Not logged in');
    }
    stringToast('Loading data...');
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    if (parentId) {
      params.append('parentId', parentId);
    }
    if (excludeId) {
      params.append('excludeId', excludeId);
    }
    if (parentOfId) {
      params.append('parentOfId', parentOfId);
    }
    if (excludeParentId) {
      params.append('excludeParentId', excludeParentId);
    }
    if (excludeParentOfId) {
      params.append('excludeParentOfId', excludeParentOfId);
    }
    const response = await client.get('/entity-category', {
      params,
    });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    entityCategoryList = response.data?.data ?? [];
    page = 1;
    max = response.data?.totalPage ?? 1;
    return stringToast('Data loaded successfully');
  }
  const [debounceReloadData, cancelDebounceCall] = cancelableDebounce(reloadData);
  export function cancelAndReload() {
    cancelDebounceCall();
    reloadData();
  }

  $effect(() => {
    if (show || alwaysshow) {
      entityCategoryList = [];
      setTimeout(cancelAndReload);
    }
  });

  $effect(() => {
    if (show || alwaysshow) {
      parentId;
      parentOfId;
      entityCategoryList = [];
      setTimeout(cancelAndReload);
    }
  });

  $effect(() => {
    if (show || alwaysshow) {
      page;
      search;
      setTimeout(debounceReloadData);
    }
  });

  let addEntityCategoryDialog: HTMLDialogElement | undefined = $state();
  function showAddModal() {
    addEntityCategoryDialog?.showModal();
  }

  let modifyEntityCategoryDialog = $state<HTMLDialogElement>();
  let selectedCategoryId = $state<string>();
  let selectedCategoryName = $state<string>();
  function showModifyModal(id: string, name: string) {
    return () => {
      selectedCategoryId = id;
      selectedCategoryName = name;
      modifyEntityCategoryDialog?.showModal();
    };
  }

  function onClickAddChild(addChildId: string) {
    return async () => {
      if (!categoryId) {
        return stringToast('Missing category id');
      }
      const response = await client(`/entity-category/${path}/${addChildId}`, {
        method,
        data: {
          addParentId: categoryId,
        },
      });
      if (response.status !== 200) {
        return stringToast('Failed to add child');
      }
      stringToast('Successfully added child');
      cancelAndReload();
      onAddChild?.();
    };
  }

  function onClickRemoveChild(removeChildId: string) {
    return async () => {
      if (!categoryId) {
        return stringToast('Missing category id');
      }
      const response = await client(`/entity-category/${path}/${removeChildId}`, {
        method,
        data: {
          removeParentId: categoryId,
        },
      });
      if (response.status !== 200) {
        return stringToast('Failed to remove child');
      }
      stringToast('Successfully remove child');
      cancelAndReload();
      onRemoveChild?.();
    };
  }

  function onClickAddParent(addParentId: string) {
    return async () => {
      if (!categoryId) {
        return stringToast('Missing category id');
      }
      const response = await client(`/entity-category/${path}/${categoryId}`, {
        method,
        data: {
          addParentId,
        },
      });
      if (response.status !== 200) {
        return stringToast('Failed to add parent');
      }
      stringToast('Successfully added parent');
      cancelAndReload();
      onAddParent?.();
    };
  }

  function onClickRemoveParent(removeParentId: string) {
    return async () => {
      if (!categoryId) {
        return stringToast('Missing category id');
      }
      const response = await client(`/entity-category/${path}/${categoryId}`, {
        method,
        data: {
          removeParentId,
        },
      });
      if (response.status !== 200) {
        return stringToast('Failed to remove parent');
      }
      stringToast('Successfully remove parent');
      cancelAndReload();
      onRemoveParent?.();
    };
  }
</script>

{#if addCategory}
  <AddEntityCategoryModal bind:dialog={addEntityCategoryDialog} onsuccess={cancelAndReload}/>
{/if}
{#if modify}
  <ModifyEntityCategoryModal
    bind:dialog={modifyEntityCategoryDialog}
    bind:categoryid={selectedCategoryId}
    bind:title={selectedCategoryName}
    onupdate={cancelAndReload}
  />
{/if}
<Collapse5
  class={clazz}
  {title}
  bind:show
  {alwaysshow}
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={cancelAndReload}
    onadd={addCategory ? showAddModal : undefined}
  />
  <Table5 itemList={entityCategoryList}>
    {#snippet header()}
      <td>Id</td>
      <td>Name</td>
      {#if modify}
        <td></td>
      {/if}
      {#if addChild}
        <td></td>
      {/if}
      {#if removeChild}
        <td></td>
      {/if}
      {#if addParent}
        <td></td>
      {/if}
      {#if removeParent}
        <td></td>
      {/if}
      <td>Label</td>
      <td>Description</td>
    {/snippet}

    {#snippet content(category)}
      <td><NoWrap class="font-mono">{category.id}</NoWrap></td>
      <td><NoWrap>{category.name}</NoWrap></td>
      {#if modify}
        <td><EditButton onclick={showModifyModal(category.id, category.name)}/></td>
      {/if}
      {#if addChild}
        <td><AddButton onclick={onClickAddChild(category.id)}/></td>
      {/if}
      {#if removeChild}
        <td><DeleteButton onclick={onClickRemoveChild(category.id)}/></td>
      {/if}
      {#if addParent}
        <td><AddButton onclick={onClickAddParent(category.id)}/></td>
      {/if}
      {#if removeParent}
        <td><DeleteButton onclick={onClickRemoveParent(category.id)}/></td>
      {/if}
      <td><NoWrap>{category.label}</NoWrap></td>
      <td>{category.description}</td>
    {/snippet}
  </Table5>
</Collapse5>
