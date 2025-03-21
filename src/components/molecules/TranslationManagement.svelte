<script lang="ts">
  import { stringToast } from '@/lib/helper/toast';
  import { SuperAdminStore } from '@/store/store';
  import type { AuthStore } from '@/types';
  import type { Translation } from '@/types/translation';
  import type { AxiosInstance } from 'axios';
  import { Icon } from 'svelte-icons-pack';
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import { LuFileJson } from 'svelte-icons-pack/lu';
  import type { Writable } from 'svelte/store';
  import NoWrap from '../atoms/NoWrap.svelte';
  import PaginationNavigationPanel from '../atoms/PaginationNavigationPanel.svelte';
  import Collapse5 from '../Collapse5.svelte';
  import Table5 from '../Table5.svelte';
  import AddTranslationModal from './AddTranslationModal.svelte';
  import ModifyTranslationModal from './ModifyTranslationModal.svelte';
  import ViewTranslationObjectModal from './ViewTranslationObjectModal.svelte';
  import { debounce } from '@/lib/helper/util';

  type Props = {
    client: AxiosInstance,
    store?: Writable<AuthStore>,
  };
  let {
    client,
    store = SuperAdminStore,
  }: Props = $props();

  let langList:string[] = $state([]);
  let platformList:string[] = $state([]);
  let translationList:Translation[] = $state([]);
  let search = $state(''); 
  let page = $state(1);
  let max = $state(1);

  async function reloadData() {
    if (!$store.loggedIn) {
      return stringToast('Not logged in');
    }

    stringToast('Loading...');

    const params = new URLSearchParams({ search });

    const response = await client.get(
      '/translation',
      { params },
    );
    if (response.status !== 200) {
      return stringToast('Failed to load data');
    }
    stringToast('Data loaded');

    translationList = response.data?.data ?? [];
  }

  const debounceReloadData = debounce(reloadData);

  $effect(() => {
    search;
    page = 1;
  });

  $effect(() => {
    search;
    page;
    debounceReloadData();
  });

  async function getLangList() {
    const response = await client.get('/translation/lang');
    langList = response.data?.data ?? [];
  }
  async function getPlatformList() {
    const response = await client.get('/translation/platform');
    platformList = response.data?.data ?? [];
  }

  let addTranslationDialog:HTMLDialogElement|undefined = $state();
  async function showAddModal() {
    await getLangList();
    await getPlatformList();
    addTranslationDialog?.showModal();
  }

  let modifyTranslationDialog:HTMLDialogElement|undefined = $state();
  let selectedTranslation:Translation|undefined = $state();
  function modifyTranslation(translation: Translation) {
    return () => {
      selectedTranslation = translation;
      modifyTranslationDialog?.showModal();
    };
  }
  function successModifyTranslation() {
    stringToast('Translation modified');
    modifyTranslationDialog?.close();
    reloadData();
  }

  let viewModal:HTMLDialogElement|undefined = $state();
  function openViewModal() {
    viewModal?.showModal();
  }
</script>

<AddTranslationModal
  bind:dialog={addTranslationDialog}
  {client}
  onsuccess={reloadData}
  bind:langList
  bind:platformList
/>
<ModifyTranslationModal
  {client}
  bind:item={selectedTranslation}
  bind:dialog={modifyTranslationDialog}
  onsuccess={successModifyTranslation}
/>
<ViewTranslationObjectModal
  {client}
  bind:dialog={viewModal}
/>
<Collapse5
  title="Translation Management"
  class="w-full"
>
  <PaginationNavigationPanel
    bind:search
    bind:page
    bind:max
    onreload={reloadData}
    onadd={showAddModal}
  />
  <button class="btn bg-slate-600"
    onclick={openViewModal}
  >
    <Icon src={LuFileJson}/>
  </button>
  {#if translationList.length > 0}
    <Table5
      itemList={translationList}
    >
      {#snippet colgroup()}
        <colgroup>
          <col class="max-w-fit">
          <col class="max-w-fit">
          <col>
          <col>
          <col>
          <col class="w-full">
        </colgroup>
      {/snippet}

      {#snippet header()}
        <th>Id</th>
        <th></th>
        <th>Language</th>
        <th>Platform</th>
        <th>Key</th>
        <th>Value</th>
      {/snippet}

      {#snippet content(translation: Translation)}
        <td><NoWrap>{translation.id}</NoWrap></td>
        <td>
          <button
            onclick={modifyTranslation(translation)}
            class="btn bg-slate-600"
          >
            <Icon src={FaSolidPencil}/>
          </button>
        </td>
        <td><NoWrap>{translation.lang}</NoWrap></td>
        <td><NoWrap>{translation.platform}</NoWrap></td>
        <td><NoWrap>{translation.key}</NoWrap></td>
        <td><NoWrap>{translation.value}</NoWrap></td>
      {/snippet}
    </Table5>
  {/if}
</Collapse5>
