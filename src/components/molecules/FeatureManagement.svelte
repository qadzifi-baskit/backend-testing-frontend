<script lang="ts">
  import { Context } from '@/lib/helper/context';
  import { stringToast } from '@/lib/helper/toast';
  import { cancelableDebounce } from '@/lib/helper/util';
  import type { EntityCategory } from '@/types/entityCategory';
  import EditButton from '../atoms/EditButton.svelte';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddFeatureModal from './AddFeatureModal.svelte';
  import ModifyEntityCategoryModal from './ModifyEntityCategoryModal.svelte';

  type Props = {
    class?: string,
    modify?: boolean,
    addfeature?: boolean,
    show?: boolean,
    alwaysshow?: boolean,
    title?: string,
  };
  let {
    class: clazz = $bindable(''),
    modify,
    addfeature: addFeature,
    show = $bindable(false),
    alwaysshow = false,
    title = 'Feature Management',
  }: Props = $props();

  const authStore = Context.getStrict('auth');
  const client = Context.getStrict('client');

  let search = $state('');
  let page = $state(1);
  let max = $state(1);
  let featureList = $state<EntityCategory[]>([]);

  async function reloadData() {
    if (!show && !alwaysshow) return;
    if (!$authStore.loggedIn) {
      return stringToast('Not logged in');
    }
    const params = new URLSearchParams({
      search,
      $page: `${page}`,
    });
    const response = await client.get('/feature', {
      params,
    });
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    featureList = response.data?.data ?? [];
    page = 1;
    max = response.data?.totalPage ?? 1;
  }
  const [debounceReloadData, cancelDebounceCall] = cancelableDebounce(reloadData);
  export function cancelAndReload() {
    cancelDebounceCall();
    reloadData();
  }

  $effect(() => {
    if (show) {
      featureList = [];
      cancelAndReload();
    }
  });

  $effect(() => {
    page;
    search;
    debounceReloadData();
  });

  let addFeatureDialog: HTMLDialogElement | undefined = $state();
  function showAddModal() {
    addFeatureDialog?.showModal();
  }

  let modifyFeatureDialog = $state<HTMLDialogElement>();
  let selectedFeatureId = $state<string>();
  let selectedFeatureName = $state<string>();
  function showModifyModal(id: string, name: string) {
    return () => {
      selectedFeatureId = id;
      selectedFeatureName = name;
      modifyFeatureDialog?.showModal();
    };
  }
</script>

{#if addFeature}
  <AddFeatureModal bind:dialog={addFeatureDialog} onsuccess={cancelAndReload}/>
{/if}
{#if modify}
  <ModifyEntityCategoryModal
    bind:dialog={modifyFeatureDialog}
    bind:categoryid={selectedFeatureId}
    bind:title={selectedFeatureName}
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
    onadd={showAddModal}
  />
  <Table5 itemList={featureList}>
    {#snippet header()}
      <td>Id</td>
      <td>Name</td>
      {#if modify}
        <td></td>
      {/if}
      <td>Label</td>
      <td>Description</td>
    {/snippet}

    {#snippet content(category)}
      <td><NoWrap>{category.id}</NoWrap></td>
      <td><NoWrap>{category.name}</NoWrap></td>
      {#if modify}
        <td><EditButton onclick={showModifyModal(category.id, category.name)}/></td>
      {/if}
      <td><NoWrap>{category.label}</NoWrap></td>
      <td>{category.description}</td>
    {/snippet}
  </Table5>
</Collapse5>
